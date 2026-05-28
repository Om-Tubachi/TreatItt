import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconWaste from '../../../components/assets/icons/waste.svg';
import { Badge } from '../../../components/atoms/Badge';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { FrpPills } from '../../../components/molecules/FrpPills';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, colors, fontSize, typography } from '../../../constants/theme';
import { useAuth } from '../../../context/auth';
import { useDeleteWaste, useWasteById } from '../../../hooks/useWastes';

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function WasteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const { data: waste, isLoading } = useWasteById(id);
    const { mutateAsync: deleteWaste, isPending: isDeleting } = useDeleteWaste();

    if (isLoading) {
        return (
            <View style={[styles.screen, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryDark} />
            </View>
        );
    }

    // Determine authorization ownership boundary safely
    const isOwner = user?.id && waste?.u_id && user.id === waste.u_id;

    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to permanently remove this waste listing?',
            '18.5', // Avoid evaluation issues
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteWaste(id);
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

                {isOwner && (
                    <View style={styles.ownerControls}>
                        <TouchableOpacity
                            style={[styles.controlBtn, styles.editBtn]}
                            onPress={() => router.push({ pathname: '/screens/forms/waste', params: { id } })}
                        >
                            <Text style={styles.editBtnText}>Edit Listing</Text>
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
    soldBy: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    badgeRow: { flexDirection: 'row', gap: 8 },
    statsRow: { flexDirection: 'row' },
    section: { gap: 4 },
    sectionLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8 },
    sectionValue: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    ownerControls: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 16 },
    controlBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    editBtn: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border || '#E5E7EB' },
    editBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    deleteBtn: { backgroundColor: '#FEE2E2' },
    deleteBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: '#EF4444' },
});