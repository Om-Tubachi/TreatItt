import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useManufacturingProcessById } from '../../../hooks/useManufacturingProcesses';

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function MfgProcessDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: process, isLoading } = useManufacturingProcessById(id);

    if (isLoading || !process) return <View style={styles.screen} />;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Process Detail</Text>
                <View style={{ width: 24 }} />
            </View>
            <DetailSheet>
                <Text style={styles.name}>{process.manufacturing_process_name}</Text>

                {process.manufacturing_process_desc && (
                    <View>
                        <SectionHeader title="Description" />
                        <Text style={styles.desc}>{process.manufacturing_process_desc}</Text>
                    </View>
                )}

                <View>
                    <SectionHeader title="Recorded" />
                    <Text style={styles.meta}>{fmtDate(process.createdat)}</Text>
                </View>
            </DetailSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    name: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black, marginTop: 4 },
    desc: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, lineHeight: 20 },
    meta: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
});