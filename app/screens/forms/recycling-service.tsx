import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FormField } from '../../../components/molecules/FormField';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { usePicker } from '../../../context/picker';
import { useCreateRecyclerProcess } from '../../../hooks/useRecyclerProcesses';

export default function RecyclingServiceFormScreen() {
    const router = useRouter();
    const { treatmentSelection } = usePicker();
    const { mutateAsync: createRecyclerProcess, isPending } = useCreateRecyclerProcess();

    const [capacityKg, setCapacityKg] = useState('');
    const [charges, setCharges] = useState('');
    const [schedules, setSchedules] = useState('');

    const onSubmit = async () => {
        if (!treatmentSelection) { Alert.alert('Error', 'Select a treatment'); return; }
        if (!capacityKg) { Alert.alert('Error', 'Enter capacity'); return; }

        try {
            await createRecyclerProcess({
                treatmentId: treatmentSelection.id,
                capacityKg: parseFloat(capacityKg),
                charges: charges ? parseFloat(charges) : undefined,
                schedules: schedules || undefined,
            });
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        }
    };

    const treatmentTitle = treatmentSelection
        ? [treatmentSelection.frp?.composition?.composition_name, treatmentSelection.frp?.category?.category_name].filter(Boolean).join(' · ') || 'FRP Batch'
        : null;

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>List Recycling Service</Text>
                <View style={{ width: 24 }} />
            </View>

            <SectionHeader title="Treatment" />
            <TouchableOpacity style={styles.pickerTrigger} onPress={() => router.push('/screens/pick/treatment')}>
                {treatmentSelection ? (
                    <View style={{ gap: 2 }}>
                        <Text style={styles.pickerValueTitle}>{treatmentTitle}</Text>
                        <Text style={styles.pickerValueSub} numberOfLines={1}>
                            {treatmentSelection.treatment_processes?.treatment_methods?.method ?? '—'}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.pickerPlaceholder}>Select treatment</Text>
                )}
                <Text style={styles.pickerArrow}>›</Text>
            </TouchableOpacity>

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
    pickerTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding },
    pickerPlaceholder: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.placeholder },
    pickerValueTitle: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    pickerValueSub: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    pickerArrow: { fontSize: 20, color: colors.body },
    btn: { marginTop: 8, alignSelf: 'center' },
});