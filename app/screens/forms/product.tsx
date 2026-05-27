import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FormField } from '../../../components/molecules/FormField';
import { FrpSelector } from '../../../components/molecules/FrpSelector';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useCreateProduct } from '../../../hooks/useProducts';

const FORM_OPTS = ['pellets', 'sheet', 'powder', 'granules', 'rod'].map(s => ({ id: s, label: s }));

export default function ProductFormScreen() {
    const router = useRouter();
    const { mutateAsync: createProduct, isPending } = useCreateProduct();

    const [frpId, setFrpId] = useState<string | null>(null);
    const [form, setForm] = useState<{ id: string; label: string } | undefined>();
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!quantity) { Alert.alert('Error', 'Enter quantity'); return; }
        if (!price) { Alert.alert('Error', 'Enter price'); return; }

        try {
            await createProduct({
                frpId,
                quantity: parseFloat(quantity),
                price: parseFloat(price),
                form: form?.id,
                description: description || undefined,
            });
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        }
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>List Product</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} />

            <SectionHeader title="Details" />
            <SelectField label="Form" options={FORM_OPTS} selected={form} onSelect={setForm} />
            <FormField label="Quantity (kg)" placeholder="e.g. 600" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <FormField label="Price (₹)" placeholder="e.g. 24" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <FormField label="Description" placeholder="Optional" value={description} onChangeText={setDescription} />

            <Button label="Submit" onPress={onSubmit} loading={isPending} style={styles.btn} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    content: { padding: layout.screenPadH, gap: 16, paddingBottom: 60 },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 40, paddingBottom: 8 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    btn: { marginTop: 8, alignSelf: 'center' },
});