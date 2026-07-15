import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { AvatarRow } from '../../../components/molecules/AvatarRow';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFormTemplates } from '../../../hooks/useFormTemplates';
import { useRecyclerProcessById } from '../../../hooks/useRecyclerProcesses';
import { formatProcessDetails } from '../../../utils/processDetailsFormat';
import { formatSchedule } from '../../../utils/scheduleFormat';

export default function RecyclingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: item, isLoading } = useRecyclerProcessById(id);
    const { data: templates } = useFormTemplates();

    if (isLoading || !item) return <View style={styles.screen} />;

    const method = item.treatments?.treatment_processes?.treatment_methods?.method;
    const process = item.treatments?.treatment_processes?.process;
    const parameterSchema = item.treatments?.treatment_processes?.treatment_methods?.process_parameter_schema;
    const frp = item.treatments?.frp;

    const formattedDetails = formatProcessDetails(item.process_details, parameterSchema);
    const readableSchedule = formatSchedule(item.schedules);

    const resolvedForms = (item.accepted_form_ids ?? [])
        .map((fid: string) => templates?.find(t => t.id === fid)?.form_name || null)
        .filter((name: string | null): name is string => !!name);

    // capability_metrics is the real source per the schema — top-level fields don't exist
    const capacityKg = item.capability_metrics?.capacity_kg;
    const charges = item.capability_metrics?.charges;

    const recyclerUser = item.recyclers?.users;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Recycling Service</Text>
                <View style={{ width: 24 }} />
            </View>
            <DetailSheet>
                <Text style={styles.methodName}>{method ?? 'Standard Treatment'}</Text>
                {process && <Text style={styles.processText}>{process}</Text>}

                {frp && (
                    <Text style={styles.frpText}>
                        Handles: {[frp.composition?.composition_name, frp.category?.category_name].filter(Boolean).join(' · ') || '—'}
                    </Text>
                )}

                <View style={styles.statsRow}>
                    <StatBox label="CHARGES / KG" value={charges ? `₹${charges}` : '—'} />
                    <View style={{ width: 8 }} />
                    <StatBox label="CAPACITY" value={capacityKg ? `${capacityKg} kg` : '—'} />
                </View>

                <View>
                    <SectionHeader title="Schedule" />
                    <Text style={styles.meta}>{readableSchedule || '—'}</Text>
                </View>

                {formattedDetails.length > 0 && (
                    <View>
                        <SectionHeader title="Process Details" />
                        {formattedDetails.map((d, i) => (
                            <View key={i} style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{d.label}</Text>
                                <Text style={styles.detailValue}>{d.value}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {resolvedForms.length > 0 && (
                    <View>
                        <SectionHeader title="Accepted Compliance Forms" />
                        <Text style={styles.meta}>{resolvedForms.join(', ')}</Text>
                    </View>
                )}

                {recyclerUser && (
                    <View>
                        <SectionHeader title="Offered By" />
                        <TouchableOpacity onPress={() => router.push(`/screens/profile/${recyclerUser.id}` as any)}>
                            <AvatarRow
                                firstName={recyclerUser.first_name}
                                lastName={recyclerUser.last_name}
                                company={recyclerUser.company_name}
                            />
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
    methodName: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black, marginTop: 4 },
    processText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, marginTop: 2 },
    frpText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.primaryDark, marginTop: 6 },
    statsRow: { flexDirection: 'row', marginTop: 10 },
    meta: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    detailLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    detailValue: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.black },
});