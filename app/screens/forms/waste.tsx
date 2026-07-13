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
import { useManufacturingProcesses } from '../../../hooks/useManufacturingProcesses';
import { useUpdateWaste, useUploadWaste, useWasteById } from '../../../hooks/useWastes';
import { MetricsValue } from '../../../types/formTemplates';
import { buildMetricsPayload, hydrateMetrics } from '../../../utils/metricsPayload';
import { hasErrors, validateMetrics } from '../../../utils/metricsValidation';

const LIFECYCLE = ['pre-consumer', 'post-consumer', 'post-industrial'].map(s => ({ id: s, label: s }));

type SelectionItem = { id: string; label: string };
interface FrpHydrationState {
    composition?: SelectionItem;
    category?: SelectionItem;
    grade?: SelectionItem;
    resin?: SelectionItem;
}

export default function WasteFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const { mutateAsync: uploadWaste, isPending: isCreating } = useUploadWaste();
    const { mutateAsync: updateWaste, isPending: isUpdating } = useUpdateWaste();
    const { data: existingWaste, isLoading: isFetchingInitialData } = useWasteById(id ?? '', { enabled: !!id });
    const { data: processes = [] } = useManufacturingProcesses();
    const { data: frpLookups } = useFrp();
    const { data: templates } = useFormTemplates();
    const location = useCurrentLocation();

    const wasteTemplates = getTemplatesFor(templates, 'waste');

    const [frpId, setFrpId] = useState<string | null>(null);
    const [mfgProcess, setMfgProcess] = useState<SelectionItem | undefined>();
    const [lifecycle, setLifecycle] = useState<SelectionItem | undefined>();
    const [formTemplate, setFormTemplate] = useState<SelectionItem | undefined>();
    const [metrics, setMetrics] = useState<MetricsValue>({});
    const [metricsErrors, setMetricsErrors] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');
    const [frpHydration, setFrpHydration] = useState<FrpHydrationState | undefined>(undefined);

    const mfgOptions = processes.map((p: any) => ({ id: p.id, label: p.manufacturing_process_name }));
    const selectedTemplate = findTemplateById(templates, formTemplate?.id);

    useEffect(() => {
        if (id && existingWaste && frpLookups && templates) {
            const frpData = existingWaste.frp;
            if (frpData) {
                setFrpId(frpData.id);
                const populatedAtoms: FrpHydrationState = {};
                if (frpData.composition_id) populatedAtoms.composition = frpLookups.compositions[frpData.composition_id];
                if (frpData.category_id) populatedAtoms.category = frpLookups.categories[frpData.category_id];
                if (frpData.grade_id) populatedAtoms.grade = frpLookups.grades[frpData.grade_id];
                if (frpData.resin_id) populatedAtoms.resin = frpLookups.resins[frpData.resin_id];
                setFrpHydration(populatedAtoms);
            }

            const targetMfgId = existingWaste.manufacturing_process_id || existingWaste.manufacturing_processes?.id;
            const matchedMfg = mfgOptions.find(o => o.id === targetMfgId);
            if (matchedMfg) setMfgProcess(matchedMfg);
            else if (existingWaste.manufacturing_processes) {
                setMfgProcess({ id: existingWaste.manufacturing_processes.id, label: existingWaste.manufacturing_processes.manufacturing_process_name });
            }

            if (existingWaste.lifecycle_stage) {
                const matchedLifecycle = LIFECYCLE.find(o => o.id === existingWaste.lifecycle_stage.toLowerCase());
                setLifecycle(matchedLifecycle || { id: existingWaste.lifecycle_stage, label: existingWaste.lifecycle_stage });
            }

            if (existingWaste.form_template_id) {
                const tmpl = findTemplateById(templates, existingWaste.form_template_id);
                if (tmpl) {
                    setFormTemplate({ id: tmpl.id, label: tmpl.form_name });
                    setMetrics(hydrateMetrics(tmpl.metrics_schema, existingWaste.metrics, 'exact') as MetricsValue);
                }
            }

            setQuantity(existingWaste.quantity ? String(existingWaste.quantity) : '');
            setPricePerKg(existingWaste.price_per_kg ? String(existingWaste.price_per_kg) : '');
            location.setLocation(existingWaste.latitude ? Number(existingWaste.latitude) : null, existingWaste.longitude ? Number(existingWaste.longitude) : null);
        }
    }, [existingWaste, id, frpLookups, processes, templates]);

    const onTemplateSelect = (o: SelectionItem) => {
        setFormTemplate(o);
        setMetrics({});
        setMetricsErrors({});
    };

    const onMetricChange = (key: string, value: any) => {
        setMetrics(prev => ({ ...prev, [key]: value }));
        if (metricsErrors[key]) setMetricsErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!mfgProcess) { Alert.alert('Error', 'Select manufacturing process'); return; }
        if (!quantity) { Alert.alert('Error', 'Enter quantity'); return; }

        let metricsPayload: MetricsValue = {};
        if (selectedTemplate) {
            const errors = validateMetrics(selectedTemplate.metrics_schema, metrics, 'exact');
            if (hasErrors(errors)) {
                setMetricsErrors(errors);
                Alert.alert('Error', 'Please fill all specification fields correctly');
                return;
            }
            metricsPayload = buildMetricsPayload(selectedTemplate.metrics_schema, metrics, 'exact') as MetricsValue;
        }

        const payload = {
            frpId,
            manufacturingProcessId: mfgProcess.id,
            quantity: parseFloat(quantity),
            lifecycleStage: lifecycle?.id,
            formTemplateId: formTemplate?.id ?? null,
            metrics: metricsPayload,
            pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
            latitude: location.latitude ?? undefined,
            longitude: location.longitude ?? undefined,
        };

        try {
            if (id) {
                await updateWaste({ id, body: payload });
            } else {
                await uploadWaste(payload);
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
                <Text style={styles.title}>{id ? 'Edit Waste' : 'List Waste'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} initialValues={frpHydration} />

            <SectionHeader title="Process" />
            <SelectField label="Manufacturing Process" options={mfgOptions} selected={mfgProcess} onSelect={setMfgProcess} />

            <SectionHeader title="Form Type" />
            <SelectField
                label="Form Template"
                options={wasteTemplates.map(t => ({ id: t.id, label: t.form_name }))}
                selected={formTemplate}
                onSelect={onTemplateSelect}
                placeholder="Optional — select a form type"
            />

            {selectedTemplate && (
                <DynamicMetricsFields
                    schema={selectedTemplate.metrics_schema}
                    mode="exact"
                    values={metrics}
                    errors={metricsErrors}
                    onChange={onMetricChange}
                />
            )}

            <SectionHeader title="Details" />
            <SelectField label="Lifecycle Stage" options={LIFECYCLE} selected={lifecycle} onSelect={setLifecycle} />
            <FormField label="Quantity (kg)" placeholder="e.g. 340" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <FormField label="Price / kg (₹)" placeholder="e.g. 18.5" value={pricePerKg} onChangeText={setPricePerKg} keyboardType="numeric" />

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
