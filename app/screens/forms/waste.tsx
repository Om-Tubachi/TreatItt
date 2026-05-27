import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FormField } from '../../../components/molecules/FormField';
import { FrpSelector } from '../../../components/molecules/FrpSelector';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useManufacturingProcesses } from '../../../hooks/useManufacturingProcesses';
import { useUploadWaste } from '../../../hooks/useWastes';

const LIFECYCLE = ['pre-consumer', 'post-consumer', 'post-industrial'].map(s => ({ id: s, label: s }));
const FORM_OPTS = ['pellets', 'shredded', 'powder', 'sheet', 'chunk'].map(s => ({ id: s, label: s }));
const STATUS = ['un-processed', 'processing', 'processed'].map(s => ({ id: s, label: s }));

export default function WasteFormScreen() {
    const router = useRouter();
    const { mutateAsync: uploadWaste, isPending } = useUploadWaste();
    const { data: processes = [] } = useManufacturingProcesses();

    const [frpId, setFrpId] = useState<string | null>(null);
    const [mfgProcess, setMfgProcess] = useState<{ id: string; label: string } | undefined>();
    const [lifecycle, setLifecycle] = useState<{ id: string; label: string } | undefined>();
    const [form, setForm] = useState<{ id: string; label: string } | undefined>();
    const [quantity, setQuantity] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');

    const mfgOptions = processes.map((p: any) => ({ id: p.id, label: p.manufacturing_process_name }));

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!mfgProcess) { Alert.alert('Error', 'Select manufacturing process'); return; }
        if (!quantity) { Alert.alert('Error', 'Enter quantity'); return; }

        try {
            await uploadWaste({
                frpId,
                manufacturingProcessId: mfgProcess.id,
                quantity: parseFloat(quantity),
                lifecycleStage: lifecycle?.id,
                form: form?.id,
                pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
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
                <Text style={styles.title}>List Waste</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} />

            <SectionHeader title="Process" />
            <SelectField label="Manufacturing Process" options={mfgOptions} selected={mfgProcess} onSelect={setMfgProcess} />

            <SectionHeader title="Details" />
            <SelectField label="Lifecycle Stage" options={LIFECYCLE} selected={lifecycle} onSelect={setLifecycle} />
            <SelectField label="Form" options={FORM_OPTS} selected={form} onSelect={setForm} />
            <FormField label="Quantity (kg)" placeholder="e.g. 340" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <FormField label="Price / kg (₹)" placeholder="e.g. 18.5" value={pricePerKg} onChangeText={setPricePerKg} keyboardType="numeric" />

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