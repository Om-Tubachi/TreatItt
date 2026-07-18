import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FrpSelector } from '../../../components/molecules/FrpSelector';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { usePicker } from '../../../context/picker';
import { useCreateTreatment } from '../../../hooks/useTreatments';


export default function TreatmentFormScreen() {
    const router = useRouter();
    const { treatmentProcessSelection } = usePicker();
    const { mutateAsync: createTreatment, isPending } = useCreateTreatment();

    const [frpId, setFrpId] = useState<string | null>(null);

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!treatmentProcessSelection) { Alert.alert('Error', 'Select a treatment process'); return; }

        try {
            await createTreatment({ frpId, treatmentProcessId: treatmentProcessSelection.id });
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
            <TouchableOpacity style={styles.pickerTrigger} onPress={() => router.push('/screens/pick/treatment-process')}>
                {treatmentProcessSelection ? (
                    <View style={{ gap: 2 }}>
                        <Text style={styles.pickerValueTitle}>{treatmentProcessSelection.treatment_methods?.method ?? '—'}</Text>
                        <Text style={styles.pickerValueSub} numberOfLines={1}>{treatmentProcessSelection.process}</Text>
                    </View>
                ) : (
                    <Text style={styles.pickerPlaceholder}>Select treatment process</Text>
                )}
                <Text style={styles.pickerArrow}>›</Text>
            </TouchableOpacity>

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
    pickerTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding },
    pickerPlaceholder: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.placeholder },
    pickerValueTitle: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    pickerValueSub: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, maxWidth: 240 },
    pickerArrow: { fontSize: 20, color: colors.body },
    btn: { marginTop: 8, alignSelf: 'center' },
});