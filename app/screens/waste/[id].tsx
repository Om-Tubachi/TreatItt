import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconWaste from '../../../components/assets/icons/waste.svg';
import { Badge } from '../../../components/atoms/Badge';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { FrpPills } from '../../../components/molecules/FrpPills';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, colors, fontSize, typography } from '../../../constants/theme';
import { useWasteById } from '../../../hooks/useWastes';

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function WasteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: waste, isLoading } = useWasteById(id);

    if (isLoading) return <View style={styles.screen} />;

    return (
        <View style={styles.screen}>
            <View style={styles.imgArea}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>
                <IconWaste width={80} height={80} opacity={0.4} />
            </View>

            <DetailSheet>
                <Text style={styles.soldBy}>SOLD BY: {waste?.users?.username?.toUpperCase()}</Text>

                <FrpPills frp={waste?.frp} />

                <View style={styles.badgeRow}>
                    {waste?.lifecycle_stage && <Badge label={waste.lifecycle_stage} variant="amber" />}
                    {waste?.status && <Badge label={waste.status} variant="outlined" />}
                </View>

                <View style={styles.statsRow}>
                    <StatBox label="QTY" value={waste?.quantity ? `${waste.quantity} kg` : '—'} />
                    <View style={{ width: 8 }} />
                    <StatBox label="PRICE / KG" value={waste?.price_per_kg ? `₹${waste.price_per_kg}` : '—'} />
                </View>

                {waste?.form && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>FORM</Text>
                        <Text style={styles.sectionValue}>{waste.form}</Text>
                    </View>
                )}

                {waste?.manufacturing_processes?.manufacturing_process_name && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>MANUFACTURING PROCESS</Text>
                        <Text style={styles.sectionValue}>{waste.manufacturing_processes.manufacturing_process_name}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>DATE</Text>
                    <Text style={styles.sectionValue}>{fmtDate(waste?.date)}</Text>
                </View>
            </DetailSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    imgArea: { height: 260, alignItems: 'center', justifyContent: 'center' },
    backBtn: { position: 'absolute', top: 56, left: 20 },
    back: { fontSize: 28, color: colors.black },
    soldBy: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    badgeRow: { flexDirection: 'row', gap: 8 },
    statsRow: { flexDirection: 'row' },
    section: { gap: 4 },
    sectionLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8 },
    sectionValue: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
});