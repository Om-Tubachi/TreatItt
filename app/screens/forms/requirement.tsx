import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FormField } from '../../../components/molecules/FormField';
import { FrpSelector } from '../../../components/molecules/FrpSelector';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useCreateRequirement } from '../../../hooks/useRequirements';

const URGENCY = ['urgent', 'normal', 'low'].map(s => ({ id: s, label: s }));

export default function RequirementFormScreen() {
    const router = useRouter();
    const { mutateAsync: createRequirement, isPending } = useCreateRequirement();

    const [frpId, setFrpId] = useState<string | null>(null);
    const [urgency, setUrgency] = useState<{ id: string; label: string } | undefined>();
    const [estReqPerMonth, setEstReqPerMonth] = useState('');
    const [actReqPerMonth, setActReqPerMonth] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!estReqPerMonth) { Alert.alert('Error', 'Enter estimated requirement'); return; }

        try {
            await createRequirement({
                frpId,
                estReqPerMonth: parseFloat(estReqPerMonth),
                actReqPerMonth: actReqPerMonth ? parseFloat(actReqPerMonth) : undefined,
                urgency: urgency?.id,
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
                <Text style={styles.title}>Post Requirement</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} />

            <SectionHeader title="Details" />
            <SelectField label="Urgency" options={URGENCY} selected={urgency} onSelect={setUrgency} />
            <FormField label="Est. Req / Month (kg)" placeholder="e.g. 1200" value={estReqPerMonth} onChangeText={setEstReqPerMonth} keyboardType="numeric" />
            <FormField label="Act. Req / Month (kg)" placeholder="Optional" value={actReqPerMonth} onChangeText={setActReqPerMonth} keyboardType="numeric" />
            <FormField label="Price / kg (₹)" placeholder="e.g. 42" value={pricePerKg} onChangeText={setPricePerKg} keyboardType="numeric" />

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