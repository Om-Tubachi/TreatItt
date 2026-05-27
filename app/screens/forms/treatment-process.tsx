import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { FormField } from '../../../components/molecules/FormField';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { SelectField } from '../../../components/molecules/SelectField';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useAllTreatmentMethods } from '../../../hooks/useTreatmentMethods';
import { useCreateTreatmentProcess } from '../../../hooks/useTreatmentProcesses';

export default function TreatmentProcessFormScreen() {
    const router = useRouter();
    const { data: methods = [] } = useAllTreatmentMethods();
    const { mutateAsync: createTreatmentProcess, isPending } = useCreateTreatmentProcess();

    const [method, setMethod] = useState<{ id: string; label: string } | undefined>();
    const [process, setProcess] = useState('');

    const methodOptions = methods.map((m: any) => ({ id: m.id, label: m.method }));

    const onSubmit = async () => {
        if (!method) { Alert.alert('Error', 'Select a treatment method'); return; }
        if (!process) { Alert.alert('Error', 'Enter process description'); return; }

        try {
            await createTreatmentProcess({ methodId: method.id, process });
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        }
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Create Treatment Process</Text>
                <View style={{ width: 24 }} />
            </View>

            <SectionHeader title="Method" />
            <SelectField label="Treatment Method" options={methodOptions} selected={method} onSelect={setMethod} />

            <SectionHeader title="Process" />
            <FormField label="Process Description" placeholder="e.g. Hammer mill + cyclone separation" value={process} onChangeText={setProcess} />

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