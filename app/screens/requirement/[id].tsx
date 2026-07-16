import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconRequirement from '../../../components/assets/icons/requirement.svg';
import { Badge } from '../../../components/atoms/Badge';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { AvatarRow } from '../../../components/molecules/AvatarRow';
import { FrpPills } from '../../../components/molecules/FrpPills';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, colors, fontSize, typography } from '../../../constants/theme';
import { useAuth } from '../../../context/auth';
import { useDeleteRequirement, useRequirementById } from '../../../hooks/useRequirements';

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function RequirementDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const { data: req, isLoading } = useRequirementById(id);
    const { mutateAsync: deleteRequirement, isPending: isDeleting } = useDeleteRequirement();

    if (isLoading) {
        return (
            <View style={[styles.screen, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryDark} />
            </View>
        );
    }

    // Determine authorization ownership boundary safely
    const isOwner = user?.id && req?.u_id && user.id === req.u_id;

    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to permanently remove this requirement posting?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRequirement(id);
                            router.back();
                        } catch (e: any) {
                            Alert.alert('Deletion Failed', e.message || 'An error occurred.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.screen}>
            <View style={styles.imgArea}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>
                <IconRequirement width={80} height={80} opacity={0.4} />
            </View>

            <DetailSheet>
                <View style={styles.headerRow}>
                    <Text style={styles.typeLabel}>REQUIREMENT</Text>
                    <View style={styles.badges}>
                        {req?.urgency && <Badge label={req.urgency} variant={req.urgency.toLowerCase() === 'urgent' ? 'urgent' : 'outlined'} />}
                        {req?.status && <Badge label={req.status} variant="accepting" />}
                    </View>
                </View>

                <FrpPills frp={req?.frp} expanded={false} />

                <View style={styles.statsRow}>
                    <StatBox label="EST REQ/MONTH" value={req?.est_req_per_month ? `${req.est_req_per_month} kg` : '—'} />
                    <View style={{ width: 8 }} />
                    <StatBox label="ACT REQ/MONTH" value={req?.act_req_per_month ? `${req.act_req_per_month} kg` : '—'} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>PRICE / KG</Text>
                    <Text style={styles.price}>₹{req?.price_per_kg ?? '—'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>DATE</Text>
                    <Text style={styles.sectionValue}>{fmtDate(req?.date)}</Text>
                </View>

                <AvatarRow
                    firstName={req?.users?.first_name}
                    lastName={req?.users?.last_name}
                    company={req?.users?.company_name}
                />

                {isOwner && (
                    <View style={styles.ownerControls}>
                        <TouchableOpacity
                            style={[styles.controlBtn, styles.editBtn]}
                            onPress={() => router.push({ pathname: '/screens/forms/requirement', params: { id } })}
                        >
                            <Text style={styles.editBtnText}>Edit Posting</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.controlBtn, styles.deleteBtn]}
                            onPress={handleDelete}
                            disabled={isDeleting}
                        >
                            <Text style={styles.deleteBtnText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </DetailSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    centered: { justifyContent: 'center', alignItems: 'center' },
    imgArea: { height: 260, alignItems: 'center', justifyContent: 'center' },
    backBtn: { position: 'absolute', top: 56, left: 20 },
    back: { fontSize: 28, color: colors.black },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    typeLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 1 },
    badges: { flexDirection: 'row', gap: 6 },
    statsRow: { flexDirection: 'row' },
    section: { gap: 4 },
    sectionLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8 },
    sectionValue: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    price: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.primaryDark },
    ownerControls: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 16 },
    controlBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    editBtn: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.black || '#E5E7EB' },
    editBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    deleteBtn: { backgroundColor: '#FEE2E2' },
    deleteBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: '#EF4444' },
});