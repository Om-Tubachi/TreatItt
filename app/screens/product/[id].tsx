import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconProduct from '../../../components/assets/icons/product.svg';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { AvatarRow } from '../../../components/molecules/AvatarRow';
import { FrpPills } from '../../../components/molecules/FrpPills';
import { StatBox } from '../../../components/molecules/StatBox';
import { appBg, colors, fontSize, typography } from '../../../constants/theme';
import { useAuth } from '../../../context/auth'; // Ensure this matches your project structure path
import { useDeleteProduct, useProductById } from '../../../hooks/useProducts';

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const { data: product, isLoading } = useProductById(id);
    const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

    if (isLoading) return <View style={styles.screen} />;

    // Verification check: confirms ownership of the resource
    const isOwner = user?.id && product?.u_id && user.id === product.u_id;
    console.log(product?.updatedat);

    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to permanently remove this product listing?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(id);
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
                <IconProduct width={80} height={80} opacity={0.4} />
            </View>

            <DetailSheet>


                <Text style={styles.soldBy}>SOLD BY: {product?.users?.username?.toUpperCase()}</Text>
                <FrpPills frp={product?.frp} />

                {product?.form && <Text style={styles.form}>{product.form}</Text>}

                <View style={styles.statsRow}>
                    <StatBox label="PRICE" value={product?.price ? `₹${product.price}` : '—'} />
                    <View style={{ width: 8 }} />
                    <StatBox label="QTY" value={product?.quantity ? `${product.quantity} kg` : '—'} />
                </View>

                {product?.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
                        <Text style={styles.sectionValue}>{product.description}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>DATE</Text>
                    <Text style={styles.sectionValue}>{fmtDate(product?.updatedat)}</Text>
                </View>

                <AvatarRow
                    firstName={product?.users?.first_name}
                    lastName={product?.users?.last_name}
                    company={product?.users?.company_name}
                />

                {isOwner && (
                    <View style={styles.ownerControls}>
                        <TouchableOpacity
                            style={[styles.controlBtn, styles.editBtn]}
                            onPress={() => router.push({ pathname: '/screens/forms/product', params: { id } })}
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
    imgArea: { height: 260, alignItems: 'center', justifyContent: 'center' },
    backBtn: { position: 'absolute', top: 56, left: 20 },
    back: { fontSize: 28, color: colors.black },
    soldBy: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    form: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
    statsRow: { flexDirection: 'row' },
    section: { gap: 4 },
    sectionLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8 },
    sectionValue: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    ownerControls: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    controlBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    editBtn: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border || '#E5E7EB' },
    editBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    deleteBtn: { backgroundColor: '#FEE2E2' },
    deleteBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: '#EF4444' },
});