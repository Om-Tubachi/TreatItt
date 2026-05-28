import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FormField } from '../../../components/molecules/FormField';
import { FrpSelector } from '../../../components/molecules/FrpSelector';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFrp } from '../../../hooks/useFrp';
import { useCreateProduct, useProductById, useUpdateProduct } from '../../../hooks/useProducts';

const FORM_OPTS = ['pellets', 'sheet', 'powder', 'granules', 'rod'].map(s => ({ id: s, label: s }));

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

    const [frpId, setFrpId] = useState<string | null>(null);
    const [form, setForm] = useState<{ id: string; label: string } | undefined>();
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    // Consolidate into a single controlled initial state structure for the selector layer
    const [frpHydration, setFrpHydration] = useState<FrpHydrationState | undefined>(undefined);

    useEffect(() => {
        if (id && existingProduct && frpLookups) {
            const frpData = existingProduct.frp;

            if (frpData) {
                setFrpId(frpData.id);

                // Build out the dynamic hydration dictionary directly from the query maps
                const populatedAtoms: FrpHydrationState = {};

                if (frpData.composition_id) {
                    populatedAtoms.composition = frpLookups.compositions[frpData.composition_id];
                }
                if (frpData.category_id) {
                    populatedAtoms.category = frpLookups.categories[frpData.category_id];
                }
                if (frpData.grade_id) {
                    populatedAtoms.grade = frpLookups.grades[frpData.grade_id];
                }
                if (frpData.resin_id) {
                    populatedAtoms.resin = frpLookups.resins[frpData.resin_id];
                }

                setFrpHydration(populatedAtoms);
            }

            if (existingProduct.form) {
                const matchedForm = FORM_OPTS.find(o => o.id === existingProduct.form);
                setForm(matchedForm || { id: existingProduct.form, label: existingProduct.form });
            }
            setQuantity(existingProduct.quantity ? String(existingProduct.quantity) : '');
            setPrice(existingProduct.price ? String(existingProduct.price) : '');
            setDescription(existingProduct.description || '');
        }
    }, [existingProduct, id, frpLookups]);

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!quantity) { Alert.alert('Error', 'Enter quantity'); return; }
        if (!price) { Alert.alert('Error', 'Enter price'); return; }

        const payload = {
            frpId,
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            form: form?.id,
            description: description || undefined,
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

            {/* Render the clean atom structure using the unified hydration prop */}
            <FrpSelector
                onFrpResolved={setFrpId}
                initialValues={frpHydration}
            />

            <SectionHeader title="Details" />
            <SelectField label="Form" options={FORM_OPTS} selected={form} onSelect={setForm} />
            <FormField label="Quantity (kg)" placeholder="e.g. 600" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <FormField label="Price (₹)" placeholder="e.g. 24" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <FormField label="Description" placeholder="Optional" value={description} onChangeText={setDescription} />

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
});