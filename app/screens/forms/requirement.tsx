import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { DynamicMetricsFields } from '../../../components/molecules/DynamicMetricsFields';
import { FormField } from '../../../components/molecules/FormField';
import { FrpSelector } from '../../../components/molecules/FrpSelector';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation';
import { findTemplateById, getTemplatesFor, useFormTemplates } from '../../../hooks/useFormTemplates';
import { useFrp } from '../../../hooks/useFrp';
import { useCreateRequirement, useRequirementById, useUpdateRequirement } from '../../../hooks/useRequirements';
import { MetricsRangeValue } from '../../../types/formTemplates';
import { buildMetricsPayload, hydrateMetrics } from '../../../utils/metricsPayload';
import { hasErrors, validateMetrics } from '../../../utils/metricsValidation';

const URGENCY = ['urgent', 'normal', 'low'].map(s => ({ id: s, label: s }));

type SelectionItem = { id: string; label: string };
interface FrpHydrationState {
    composition?: SelectionItem;
    category?: SelectionItem;
    grade?: SelectionItem;
    resin?: SelectionItem;
}

export default function RequirementFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const { mutateAsync: createRequirement, isPending: isCreating } = useCreateRequirement();
    const { mutateAsync: updateRequirement, isPending: isUpdating } = useUpdateRequirement();
    const { data: existingRequirement, isLoading: isFetchingInitialData } = useRequirementById(id ?? '', { enabled: !!id });
    const { data: frpLookups } = useFrp();
    const { data: templates } = useFormTemplates();
    const location = useCurrentLocation();

    // requirement templates typically overlap with product templates in applies_to;
    // fall back to union of 'product'/'waste' tagged templates if none are tagged 'requirement' explicitly
    const requirementTemplates = getTemplatesFor(templates, 'requirement').length
        ? getTemplatesFor(templates, 'requirement')
        : (templates ?? []);

    const [frpId, setFrpId] = useState<string | null>(null);
    const [urgency, setUrgency] = useState<SelectionItem | undefined>();
    const [formTemplate, setFormTemplate] = useState<SelectionItem | undefined>();
    const [metricsRange, setMetricsRange] = useState<MetricsRangeValue>({});
    const [metricsErrors, setMetricsErrors] = useState<Record<string, string>>({});
    const [estReqPerMonth, setEstReqPerMonth] = useState('');
    const [actReqPerMonth, setActReqPerMonth] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');
    const [frpHydration, setFrpHydration] = useState<FrpHydrationState | undefined>(undefined);

    const selectedTemplate = findTemplateById(templates, formTemplate?.id);

    useEffect(() => {
        if (id && existingRequirement && frpLookups && templates) {
            const frpData = existingRequirement.frp;
            if (frpData) {
                setFrpId(frpData.id);
                const populatedAtoms: FrpHydrationState = {};
                if (frpData.composition_id) populatedAtoms.composition = frpLookups.compositions[frpData.composition_id];
                if (frpData.category_id) populatedAtoms.category = frpLookups.categories[frpData.category_id];
                if (frpData.grade_id) populatedAtoms.grade = frpLookups.grades[frpData.grade_id];
                if (frpData.resin_id) populatedAtoms.resin = frpLookups.resins[frpData.resin_id];
                setFrpHydration(populatedAtoms);
            }

            if (existingRequirement.urgency) {
                const normalizedUrgency = existingRequirement.urgency.toLowerCase();
                const matchedUrgency = URGENCY.find(o => o.id === normalizedUrgency);
                setUrgency(matchedUrgency || { id: normalizedUrgency, label: normalizedUrgency });
            }

            // form_template_id is nullable — only hydrate metrics UI when one is actually set
            if (existingRequirement.form_template_id) {
                const tmpl = findTemplateById(templates, existingRequirement.form_template_id);
                if (tmpl) {
                    setFormTemplate({ id: tmpl.id, label: tmpl.form_name });
                    setMetricsRange(hydrateMetrics(tmpl.metrics_schema, existingRequirement.metrics_range, 'range') as MetricsRangeValue);
                }
            }

            setEstReqPerMonth(existingRequirement.est_req_per_month ? String(existingRequirement.est_req_per_month) : '');
            setActReqPerMonth(existingRequirement.act_req_per_month ? String(existingRequirement.act_req_per_month) : '');
            setPricePerKg(existingRequirement.price_per_kg ? String(existingRequirement.price_per_kg) : '');
            location.setLocation(existingRequirement.latitude ? Number(existingRequirement.latitude) : null, existingRequirement.longitude ? Number(existingRequirement.longitude) : null);
        }
    }, [existingRequirement, id, frpLookups, templates]);

    const onTemplateSelect = (o: SelectionItem | undefined) => {
        setFormTemplate(o);
        setMetricsRange({});
        setMetricsErrors({});
    };

    const onMetricChange = (key: string, value: any) => {
        setMetricsRange(prev => ({ ...prev, [key]: value }));
        if (metricsErrors[key]) setMetricsErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!estReqPerMonth) { Alert.alert('Error', 'Enter estimated requirement'); return; }

        let metricsPayload: MetricsRangeValue = {};
        if (selectedTemplate) {
            const errors = validateMetrics(selectedTemplate.metrics_schema, metricsRange, 'range');
            if (hasErrors(errors)) {
                setMetricsErrors(errors);
                Alert.alert('Error', 'Please fill all specification range fields correctly');
                return;
            }
            metricsPayload = buildMetricsPayload(selectedTemplate.metrics_schema, metricsRange, 'range') as MetricsRangeValue;
        }

        const payload = {
            frpId,
            estReqPerMonth: parseFloat(estReqPerMonth),
            actReqPerMonth: actReqPerMonth ? parseFloat(actReqPerMonth) : null,
            urgency: urgency?.id,
            pricePerKg: pricePerKg ? parseFloat(pricePerKg) : null,
            formTemplateId: formTemplate?.id ?? null, // explicitly nullable — "No template" is valid
            metricsRange: metricsPayload,
            latitude: location.latitude ?? undefined,
            longitude: location.longitude ?? undefined,
        };

        try {
            if (id) {
                await updateRequirement({ id, body: payload });
            } else {
                await createRequirement(payload);
            }
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Operation failed');
        }
    };

    if (id && isFetchingInitialData) {
        return (
            <View style={[styles.screen, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryDark} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>{id ? 'Edit Requirement' : 'Post Requirement'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} initialValues={frpHydration} />

            <SectionHeader title="Form Type (optional)" />
            <SelectField
                label="Form Template"
                options={requirementTemplates.map(t => ({ id: t.id, label: t.form_name }))}
                selected={formTemplate}
                onSelect={onTemplateSelect}
                placeholder="No template — freeform requirement"
            />

            {selectedTemplate && (
                <DynamicMetricsFields
                    schema={selectedTemplate.metrics_schema}
                    mode="range"
                    values={metricsRange}
                    errors={metricsErrors}
                    onChange={onMetricChange}
                />
            )}

            <SectionHeader title="Details" />
            <SelectField label="Urgency" options={URGENCY} selected={urgency} onSelect={setUrgency} />
            <FormField label="Est. Req / Month (kg)" placeholder="e.g. 1200" value={estReqPerMonth} onChangeText={setEstReqPerMonth} keyboardType="numeric" />
            <FormField label="Act. Req / Month (kg)" placeholder="Optional" value={actReqPerMonth} onChangeText={setActReqPerMonth} keyboardType="numeric" />
            <FormField label="Price / kg (₹)" placeholder="e.g. 42" value={pricePerKg} onChangeText={setPricePerKg} keyboardType="numeric" />

            <SectionHeader title="Location" />
            <TouchableOpacity onPress={location.fetchLocation} style={styles.locBtn}>
                <Text style={styles.locBtnText}>
                    {location.isFetching ? 'Fetching…' : location.latitude ? `📍 ${location.latitude.toFixed(4)}, ${location.longitude?.toFixed(4)}` : 'Tap to capture location'}
                </Text>
            </TouchableOpacity>

            <Button
                label={id ? 'Save Changes' : 'Submit'}
                onPress={onSubmit}
                loading={id ? isUpdating : isCreating}
                style={styles.btn}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    centered: { justifyContent: 'center', alignItems: 'center' },
    content: { padding: layout.screenPadH, gap: 16, paddingBottom: 60 },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 40, paddingBottom: 8 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    btn: { marginTop: 8, alignSelf: 'center' },
    locBtn: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 14, alignItems: 'center' },
    locBtnText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
});
