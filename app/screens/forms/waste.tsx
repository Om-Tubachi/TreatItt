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
import { useManufacturingProcesses } from '../../../hooks/useManufacturingProcesses';
import { useUpdateWaste, useUploadWaste, useWasteById } from '../../../hooks/useWastes';

const LIFECYCLE = ['pre-consumer', 'post-consumer', 'post-industrial'].map(s => ({ id: s, label: s }));
const FORM_OPTS = ['pellets', 'shredded', 'powder', 'sheet', 'chunk'].map(s => ({ id: s, label: s }));

type SelectionItem = { id: string; label: string };

interface FrpHydrationState {
    composition?: SelectionItem;
    category?: SelectionItem;
    grade?: SelectionItem;
    resin?: SelectionItem;
}

export default function WasteFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const { mutateAsync: uploadWaste, isPending: isCreating } = useUploadWaste();
    const { mutateAsync: updateWaste, isPending: isUpdating } = useUpdateWaste();

    const { data: existingWaste, isLoading: isFetchingInitialData } = useWasteById(id ?? '', { enabled: !!id });
    const { data: processes = [] } = useManufacturingProcesses();
    const { data: frpLookups } = useFrp();

    const [frpId, setFrpId] = useState<string | null>(null);
    const [mfgProcess, setMfgProcess] = useState<{ id: string; label: string } | undefined>();
    const [lifecycle, setLifecycle] = useState<{ id: string; label: string } | undefined>();
    const [form, setForm] = useState<{ id: string; label: string } | undefined>();
    const [quantity, setQuantity] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');

    const [frpHydration, setFrpHydration] = useState<FrpHydrationState | undefined>(undefined);

    const mfgOptions = processes.map((p: any) => ({ id: p.id, label: p.manufacturing_process_name }));

    useEffect(() => {
        if (id && existingWaste && frpLookups) {
            const frpData = existingWaste.frp;

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

            if (existingWaste.mfg_process_id || existingWaste.manufacturing_process_id) {
                const targetMfgId = existingWaste.mfg_process_id || existingWaste.manufacturing_process_id;
                const matchedMfg = mfgOptions.find(o => o.id === targetMfgId);
                if (matchedMfg) setMfgProcess(matchedMfg);
            } else if (existingWaste.manufacturing_processes) {
                setMfgProcess({
                    id: existingWaste.manufacturing_processes.id,
                    label: existingWaste.manufacturing_processes.manufacturing_process_name
                });
            }

            if (existingWaste.lifecycle_stage) {
                const matchedLifecycle = LIFECYCLE.find(o => o.id === existingWaste.lifecycle_stage.toLowerCase());
                setLifecycle(matchedLifecycle || { id: existingWaste.lifecycle_stage, label: existingWaste.lifecycle_stage });
            }

            if (existingWaste.form) {
                const matchedForm = FORM_OPTS.find(o => o.id === existingWaste.form.toLowerCase());
                setForm(matchedForm || { id: existingWaste.form, label: existingWaste.form });
            }

            setQuantity(existingWaste.quantity ? String(existingWaste.quantity) : '');
            setPricePerKg(existingWaste.price_per_kg ? String(existingWaste.price_per_kg) : '');
        }
    }, [existingWaste, id, frpLookups, processes]);

    const onSubmit = async () => {
        if (!frpId) { Alert.alert('Error', 'Select a valid FRP combination'); return; }
        if (!mfgProcess) { Alert.alert('Error', 'Select manufacturing process'); return; }
        if (!quantity) { Alert.alert('Error', 'Enter quantity'); return; }

        const payload = {
            frpId,
            manufacturingProcessId: mfgProcess.id,
            quantity: parseFloat(quantity),
            lifecycleStage: lifecycle?.id,
            form: form?.id,
            pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
        };

        try {
            if (id) {
                await updateWaste({ id, body: payload });
            } else {
                await uploadWaste(payload);
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
                <Text style={styles.title}>{id ? 'Edit Waste' : 'List Waste'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FrpSelector onFrpResolved={setFrpId} initialValues={frpHydration} />

            <SectionHeader title="Process" />
            <SelectField label="Manufacturing Process" options={mfgOptions} selected={mfgProcess} onSelect={setMfgProcess} />

            <SectionHeader title="Details" />
            <SelectField label="Lifecycle Stage" options={LIFECYCLE} selected={lifecycle} onSelect={setLifecycle} />
            <SelectField label="Form" options={FORM_OPTS} selected={form} onSelect={setForm} />
            <FormField label="Quantity (kg)" placeholder="e.g. 340" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <FormField label="Price / kg (₹)" placeholder="e.g. 18.5" value={pricePerKg} onChangeText={setPricePerKg} keyboardType="numeric" />

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