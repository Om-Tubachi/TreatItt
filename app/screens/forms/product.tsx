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
import { useCreateProduct, useProductById, useUpdateProduct } from '../../../hooks/useProducts';
import { MetricsValue } from '../../../types/formTemplates';
import { buildMetricsPayload, hydrateMetrics } from '../../../utils/metricsPayload';
import { hasErrors, validateMetrics } from '../../../utils/metricsValidation';

type SelectionItem = { id: string; label: string };
interface FrpHydrationState {
    composition?: SelectionItem;
    category?: SelectionItem;
    grade?: SelectionItem;
    resin?: SelectionItem;
}

export default function ProductFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const { data: existingProduct, isLoading: isFetchingInitialData } = useProductById(id ?? '', { enabled: !!id });
    const { data: frpLookups } = useFrp();
    const { data: templates } = useFormTemplates();
    const location = useCurrentLocation();

    const productTemplates = getTemplatesFor(templates, 'product');

    const [frpId, setFrpId] = useState<string | null>(null);
    const [formTemplate, setFormTemplate] = useState<SelectionItem | undefined>();
    const [metrics, setMetrics] = useState<MetricsValue>({});
    const [metricsErrors, setMetricsErrors] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [frpHydration, setFrpHydration] = useState<FrpHydrationState | undefined>(undefined);

    const selectedTemplate = findTemplateById(templates, formTemplate?.id);

    useEffect(() => {
        if (id && existingProduct && frpLookups && templates) {
            const frpData = existingProduct.frp;
            if (frpData) {
                setFrpId(frpData.id);
                const populatedAtoms: FrpHydrationState = {};
                if (frpData.composition_id) populatedAtoms.composition = frpLookups.compositions[frpData.composition_id];
                if (frpData.category_id) populatedAtoms.category = frpLookups.categories[frpData.category_id];
                if (frpData.grade_id) populatedAtoms.grade = frpLookups.grades[frpData.grade_id];
                if (frpData.resin_id) populatedAtoms.resin = frpLookups.resins[frpData.resin_id];
                setFrpHydration(populatedAtoms);
            }

            if (existingProduct.form_template_id) {
                const tmpl = findTemplateById(templates, existingProduct.form_template_id);
                if (tmpl) {
                    setFormTemplate({ id: tmpl.id, label: tmpl.form_name });
                    setMetrics(hydrateMetrics(tmpl.metrics_schema, existingProduct.metrics, 'exact') as MetricsValue);
                }
            }

            setQuantity(existingProduct.quantity ? String(existingProduct.quantity) : '');
            setPrice(existingProduct.price ? String(existingProduct.price) : '');
            setDescription(existingProduct.description || '');
            location.setLocation(existingProduct.latitude ? Number(existingProduct.latitude) : null, existingProduct.longitude ? Number(existingProduct.longitude) : null);
        }
    }, [existingProduct, id, frpLookups, templates]);

    const onTemplateSelect = (o: SelectionItem) => {
        setFormTemplate(o);
        setMetrics({}); // wipe on template switch — avoids stale/mismatched keys
        setMetricsErrors({});
    };

    const onMetricChange = (key: string, value: any) => {
        setMetrics(prev => ({ ...prev, [key]: value }));
        if (metricsErrors[key]) setMetricsErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!quantity) { Alert.alert('Error', 'Enter quantity'); return; }
        if (!price) { Alert.alert('Error', 'Enter price'); return; }

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
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            description: description || undefined,
            formTemplateId: formTemplate?.id ?? null,
            metrics: metricsPayload,
            latitude: location.latitude ?? undefined,
            longitude: location.longitude ?? undefined,
        };

        try {
            if (id) {
                await updateProduct({ id, body: payload });
            } else {
                await createProduct(payload);
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
                <Text style={styles.title}>{id ? 'Edit Listing' : 'List Product'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} initialValues={frpHydration} />

            <SectionHeader title="Form Type" />
            <SelectField
                label="Form Template"
                options={productTemplates.map(t => ({ id: t.id, label: t.form_name }))}
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
            <FormField label="Quantity (kg)" placeholder="e.g. 600" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <FormField label="Price (₹)" placeholder="e.g. 24" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <FormField label="Description" placeholder="Optional" value={description} onChangeText={setDescription} />

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
