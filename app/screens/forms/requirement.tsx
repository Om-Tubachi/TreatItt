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
import { useCreateRequirement, useRequirementById, useUpdateRequirement } from '../../../hooks/useRequirements';

const URGENCY = ['urgent', 'normal', 'low'].map(s => ({ id: s, label: s }));

type SelectionItem = { id: string; label: string };

interface FrpHydrationState {
    composition?: SelectionItem;
    category?: SelectionItem;
    grade?: SelectionItem;
    resin?: SelectionItem;
}

export default function RequirementFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const { mutateAsync: createRequirement, isPending: isCreating } = useCreateRequirement();
    const { mutateAsync: updateRequirement, isPending: isUpdating } = useUpdateRequirement();

    const { data: existingRequirement, isLoading: isFetchingInitialData } = useRequirementById(id ?? '', { enabled: !!id });
    const { data: frpLookups } = useFrp();

    const [frpId, setFrpId] = useState<string | null>(null);
    const [urgency, setUrgency] = useState<{ id: string; label: string } | undefined>();
    const [estReqPerMonth, setEstReqPerMonth] = useState('');
    const [actReqPerMonth, setActReqPerMonth] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');

    const [frpHydration, setFrpHydration] = useState<FrpHydrationState | undefined>(undefined);

    useEffect(() => {
        if (id && existingRequirement && frpLookups) {
            const frpData = existingRequirement.frp;

            if (frpData) {
                setFrpId(frpData.id);

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

            if (existingRequirement.urgency) {
                const normalizedUrgency = existingRequirement.urgency.toLowerCase();
                const matchedUrgency = URGENCY.find(o => o.id === normalizedUrgency);
                setUrgency(matchedUrgency || { id: normalizedUrgency, label: normalizedUrgency });
            }

            setEstReqPerMonth(existingRequirement.est_req_per_month ? String(existingRequirement.est_req_per_month) : '');
            setActReqPerMonth(existingRequirement.act_req_per_month ? String(existingRequirement.act_req_per_month) : '');
            setPricePerKg(existingRequirement.price_per_kg ? String(existingRequirement.price_per_kg) : '');
        }
    }, [existingRequirement, id, frpLookups]);

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!estReqPerMonth) { Alert.alert('Error', 'Enter estimated requirement'); return; }

        const payload = {
            frpId,
            estReqPerMonth: parseFloat(estReqPerMonth),
            actReqPerMonth: actReqPerMonth ? parseFloat(actReqPerMonth) : null,
            urgency: urgency?.id,
            pricePerKg: pricePerKg ? parseFloat(pricePerKg) : null,
        };

        try {
            if (id) {
                await updateRequirement({ id, body: payload });
            } else {
                await createRequirement(payload);
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
                <Text style={styles.title}>{id ? 'Edit Requirement' : 'Post Requirement'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} initialValues={frpHydration} />

            <SectionHeader title="Details" />
            <SelectField label="Urgency" options={URGENCY} selected={urgency} onSelect={setUrgency} />
            <FormField label="Est. Req / Month (kg)" placeholder="e.g. 1200" value={estReqPerMonth} onChangeText={setEstReqPerMonth} keyboardType="numeric" />
            <FormField label="Act. Req / Month (kg)" placeholder="Optional" value={actReqPerMonth} onChangeText={setActReqPerMonth} keyboardType="numeric" />
            <FormField label="Price / kg (₹)" placeholder="e.g. 42" value={pricePerKg} onChangeText={setPricePerKg} keyboardType="numeric" />

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