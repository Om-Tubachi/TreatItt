import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FormField } from '../../../components/molecules/FormField';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useCreateRecyclerProcess } from '../../../hooks/useRecyclerProcesses';
import { useAllTreatments } from '../../../hooks/useTreatments';

export default function RecyclingServiceFormScreen() {
    const router = useRouter();
    const { data: treatments = [] } = useAllTreatments();
    const { mutateAsync: createRecyclerProcess, isPending } = useCreateRecyclerProcess();

    const [treatment, setTreatment] = useState<{ id: string; label: string } | undefined>();
    const [capacityKg, setCapacityKg] = useState('');
    const [charges, setCharges] = useState('');
    const [schedules, setSchedules] = useState('');

    const treatmentOptions = treatments.map((t: any) => ({
        id: t.id,
        label: `${t.treatment_processes?.treatment_methods?.method ?? '—'} · ${t.treatment_processes?.process ?? '—'}`
    }));

    const onSubmit = async () => {
        if (!treatment) { Alert.alert('Error', 'Select a treatment'); return; }
        if (!capacityKg) { Alert.alert('Error', 'Enter capacity'); return; }

        try {
            await createRecyclerProcess({
                treatmentId: treatment.id,
                capacityKg: parseFloat(capacityKg),
                charges: charges ? parseFloat(charges) : undefined,
                schedules: schedules || undefined,
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
                <Text style={styles.title}>List Recycling Service</Text>
                <View style={{ width: 24 }} />
            </View>

            <SectionHeader title="Treatment" />
            <SelectField label="Treatment" options={treatmentOptions} selected={treatment} onSelect={setTreatment} />

            <SectionHeader title="Capacity & Pricing" />
            <FormField label="Capacity (kg)" placeholder="e.g. 5000" value={capacityKg} onChangeText={setCapacityKg} keyboardType="numeric" />
            <FormField label="Charges / kg" placeholder="e.g. 12" value={charges} onChangeText={setCharges} keyboardType="numeric" />

            <SectionHeader title="Schedule" />
            <FormField label="Schedules" placeholder="e.g. Mon · Wed · Fri" value={schedules} onChangeText={setSchedules} />

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