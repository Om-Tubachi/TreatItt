import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FrpSelector } from '../../../components/molecules/FrpSelector';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useAllTreatmentProcesses } from '../../../hooks/useTreatmentProcesses';
import { useCreateTreatment } from '../../../hooks/useTreatments';

export default function TreatmentFormScreen() {
    const router = useRouter();
    const { data: tProcesses = [] } = useAllTreatmentProcesses();
    const { mutateAsync: createTreatment, isPending } = useCreateTreatment();

    const [frpId, setFrpId] = useState<string | null>(null);
    const [treatmentProcess, setTreatmentProcess] = useState<{ id: string; label: string } | undefined>();

    const tpOptions = tProcesses.map((p: any) => ({
        id: p.id,
        label: `${p.treatment_methods?.method ?? '—'} · ${p.process}`
    }));

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!treatmentProcess) { Alert.alert('Error', 'Select a treatment process'); return; }

        try {
            await createTreatment({ frpId, treatmentProcessId: treatmentProcess.id });
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        }
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Create Treatment</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} />

            <SectionHeader title="Treatment Process" />
            <SelectField label="Treatment Process" options={tpOptions} selected={treatmentProcess} onSelect={setTreatmentProcess} />

            <Button label="Create" onPress={onSubmit} loading={isPending} style={styles.btn} />
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