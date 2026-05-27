import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useManufacturingProcesses } from '../../../hooks/useManufacturingProcesses';

export default function MfgProcessDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: processes = [] } = useManufacturingProcesses();
    const item = processes.find((p: any) => p.id === id);

    if (!item) return <View style={styles.screen} />;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Process Detail</Text>
                <View style={{ width: 24 }} />
            </View>
            <DetailSheet>
                <SectionHeader title="Process" />
                <Text style={styles.name}>{item.manufacturing_process_name}</Text>
                {item.manufacturing_process_desc && (
                    <>
                        <SectionHeader title="Description" />
                        <Text style={styles.desc}>{item.manufacturing_process_desc}</Text>
                    </>
                )}
            </DetailSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    name: { fontFamily: typography.heading, fontSize: fontSize.lg, color: colors.black },
    desc: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
});