import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../../components/atoms/Badge';
import { Pill } from '../../../components/atoms/Pill';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { AvatarRow } from '../../../components/molecules/AvatarRow';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, colors, fontSize, layout, spacing, typography } from '../../../constants/theme';
import { useManufacturingProcessById, useManufacturingProcessStats } from '../../../hooks/useManufacturingProcesses';

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function MfgProcessDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: process, isLoading } = useManufacturingProcessById(id);
    const { data: stats } = useManufacturingProcessStats(id);

    if (isLoading || !process) return <View style={styles.screen} />;

    // §3.1 — only render stat boxes that have real data, never a padded "0" row
    const statBoxes: { label: string; value: string }[] = [];
    if (stats?.totalQuantity) statBoxes.push({ label: 'TOTAL QTY', value: `${stats.totalQuantity} kg` });
    if (stats?.listingCount) statBoxes.push({ label: 'LISTINGS', value: String(stats.listingCount) });
    if (stats?.avgPrice != null) statBoxes.push({ label: 'AVG PRICE/KG', value: `₹${stats.avgPrice.toFixed(2)}` });

    const lifecycleEntries = Object.entries(stats?.lifecycleBreakdown ?? {});
    const compositionEntries = stats?.compositionBreakdown ?? [];
    const collectors = stats?.distinctCollectors ?? [];

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

                {statBoxes.length > 0 && (
                    <View>
                        <SectionHeader title="Activity" />
                        <View style={styles.statsRow}>
                            {statBoxes.map((b, i) => (
                                <React.Fragment key={b.label}>
                                    {i > 0 && <View style={{ width: 8 }} />}
                                    <StatBox label={b.label} value={b.value} />
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                )}

                {lifecycleEntries.length > 0 && (
                    <View>
                        <SectionHeader title="Lifecycle Stages" />
                        <View style={styles.chipRow}>
                            {lifecycleEntries.map(([stage, count]) => (
                                <Badge key={stage} label={`${stage} · ${count}`} variant="amber" />
                            ))}
                        </View>
                    </View>
                )}

                {compositionEntries.length > 0 && (
                    <View>
                        <SectionHeader title="Composition Breakdown" />
                        <View style={styles.chipRow}>
                            {compositionEntries.map((c: any) => (
                                <Pill key={c.id} label={`${c.name} · ${c.count}`} />
                            ))}
                        </View>
                    </View>
                )}

                {collectors.length > 0 && (
                    <View>
                        <SectionHeader title="Collectors" />
                        <View style={{ gap: spacing.md }}>
                            {collectors.map((c: any) => (
                                <TouchableOpacity
                                    key={c.id}
                                    onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: c.id } })}
                                >
                                    <AvatarRow firstName={c.username} lastName="" company={c.company_name} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {process.user_id && (
                    <View>
                        <SectionHeader title="Offered By" />
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: process.user_id } })}
                        >
                            <Text style={styles.link}>View owner profile →</Text>
                        </TouchableOpacity>
                    </View>
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
    name: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black, marginTop: 4 },
    desc: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, lineHeight: 20 },
    meta: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
    statsRow: { flexDirection: 'row' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    link: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.primaryDark },
});
