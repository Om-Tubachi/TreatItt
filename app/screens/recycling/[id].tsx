// NOTE: the base of this screen ("existing screen from last session") wasn't in the
// pasted context, only its expected shape (RecyclingEntity type, RecyclingCard fields).
// This is a RECONSTRUCTION covering what the doc describes as already correct, plus
// the one addition it asks for: a Specializations section via aggregateRecyclerTreatments.
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../../components/atoms/Badge';
import { Pill } from '../../../components/atoms/Pill';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { AvatarRow } from '../../../components/molecules/AvatarRow';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, colors, fontSize, spacing, typography } from '../../../constants/theme';
import { useRecycleProcessById } from '../../../hooks/useRecyclerProcesses';
import { useTreatmentsByRecycler } from '../../../hooks/useTreatments';
import { aggregateRecyclerTreatments } from '../../../utils/aggregateRecyclerTreatments';
import { formatProcessDetails } from '../../../utils/processDetailsFormat';
import { formatSchedule } from '../../../utils/scheduleFormat';

export default function RecyclingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // Guard: a bad Link/router.push elsewhere in the app (e.g. an explicit
    // "/screens/recycling/index" instead of "/screens/recycling") makes Expo
    // Router treat "index" as this route's [id] param, which then 500s against
    // the backend's uuid column. Catch it here instead of showing a raw API error.
    const isValidId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id ?? '');

    // ALL hooks called unconditionally, before any early return — recyclerUserId
    // is simply undefined (and the query disabled) when isValidId is false or the
    // process record hasn't loaded yet, rather than skipping the hook call itself.
    const { data: item, isLoading } = useRecycleProcessById(id, { enabled: isValidId });
    const recyclerUserId = item?.recyclers?.users?.id;
    const { data: treatments } = useTreatmentsByRecycler(recyclerUserId!, { enabled: !!recyclerUserId });

    if (!isValidId) {
        return (
            <View style={styles.screen}>
                <View style={styles.imgArea}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.back}>‹</Text>
                    </TouchableOpacity>
                </View>
                <DetailSheet>
                    <Text style={styles.title}>Not found</Text>
                    <Text style={styles.meta}>This recycling service link looks broken — try going back and tapping the card again.</Text>
                </DetailSheet>
            </View>
        );
    }

    if (isLoading || !item) return <View style={styles.screen} />;

    const method = item.treatments?.treatment_processes?.treatment_methods?.method ?? '';
    const process = item.treatments?.treatment_processes?.process ?? '';
    const parameterSchema = item.treatments?.treatment_processes?.treatment_methods?.process_parameter_schema;
    const formattedDetails = formatProcessDetails(item.process_details, parameterSchema);
    const readableSchedule = formatSchedule(item.schedules);

    // §3.3 — Specializations section, directly implementing the frontend data spec's
    // "specialization breakdown" (method counts) and "tags of what FRP types accepted".
    const specializations = treatments ? aggregateRecyclerTreatments(treatments) : null;

    return (
        <View style={styles.screen}>
            <View style={styles.imgArea}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>
            </View>
            <DetailSheet>
                <Text style={styles.title}>{method || 'Recycling Service'}</Text>
                {process ? <Text style={styles.subtitle}>{process}</Text> : null}

                {item.recyclers?.users && (
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: item.recyclers!.users!.id } })}
                    >
                        <AvatarRow
                            firstName={item.recyclers.users.first_name}
                            lastName={item.recyclers.users.last_name}
                            company={item.recyclers.users.company_name}
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.statsRow}>
                    <StatBox label="CHARGES/KG" value={item.charges ? `₹${item.charges}` : '—'} />
                    <View style={{ width: 8 }} />
                    <StatBox label="CAPACITY" value={item.capacity_kg ? `${item.capacity_kg} kg` : '—'} />
                </View>

                {readableSchedule !== '—' && (
                    <View>
                        <SectionHeader title="Schedule" />
                        <Text style={styles.meta}>{readableSchedule}</Text>
                    </View>
                )}

                {formattedDetails.length > 0 && (
                    <View>
                        <SectionHeader title="Process Details" />
                        <View style={{ gap: 6 }}>
                            {formattedDetails.map((d, i) => (
                                <View key={i} style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>{d.label}</Text>
                                    <Text style={styles.detailValue}>{d.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {specializations && specializations.totalCount > 0 && (
                    <View>
                        <SectionHeader title="Specializations" />
                        <View style={styles.chipRow}>
                            {Object.entries(specializations.methodBreakdown).map(([m, count]) => (
                                <Badge key={m} label={`${m} · ${count}`} variant="accepting" />
                            ))}
                        </View>
                        {specializations.frpTags.length > 0 && (
                            <View style={[styles.chipRow, { marginTop: spacing.sm }]}>
                                <Text style={styles.acceptsLabel}>ACCEPTS:</Text>
                                {specializations.frpTags.map((tag) => <Pill key={tag} label={tag} />)}
                            </View>
                        )}
                    </View>
                )}
            </DetailSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    imgArea: { height: 140 },
    backBtn: { position: 'absolute', top: 56, left: 20 },
    back: { fontSize: 28, color: colors.black },
    title: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    subtitle: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
    statsRow: { flexDirection: 'row' },
    meta: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
    detailLabel: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
    detailValue: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
    acceptsLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, marginRight: 4 },
});