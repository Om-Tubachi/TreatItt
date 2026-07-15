import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AvatarRow } from '../../../components/molecules/AvatarRow';
import { ProductCard } from '../../../components/organisms/ProductCard';
import { RecyclingCard } from '../../../components/organisms/RecyclingCard';
import { RequirementCard } from '../../../components/organisms/RequirementCard';
import { WasteCard } from '../../../components/organisms/WasteCard';
import { appBg, card, colors, fontSize, layout, radius, typography } from '../../../constants/theme';
import { useManufacturingProcessesByUser } from '../../../hooks/useManufacturingProcesses';
import { useProductsByUser } from '../../../hooks/useProducts';
import { useRecycleProcessesByRecycler } from '../../../hooks/useRecyclerProcesses';
import { useRecyclerById } from '../../../hooks/useRecyclers';
import { useRequirementsByUser } from '../../../hooks/useRequirements';
import { useUserById } from '../../../hooks/useUsers';
import { useWasteEntriesOfUser } from '../../../hooks/useWastes';

const safeList = (query: { data?: any[]; isError: boolean }) =>
    query.isError ? [] : (query.data ?? []);

type TabType = 'products' | 'requirements' | 'waste' | 'recycling' | 'mfg';

export default function ProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { data: user, isLoading } = useUserById(id);

    const products = useProductsByUser(id, { retry: 0 });
    const requirements = useRequirementsByUser(id, { retry: 0 });
    const wastes = useWasteEntriesOfUser(id, { retry: 0 });
    const mfgProcesses = useManufacturingProcessesByUser(id, { retry: 0 });

    const recycler = useRecyclerById(id, { retry: 0 });
    const isRecycler = !!recycler.data && !recycler.isError;
    const recycleProcesses = useRecycleProcessesByRecycler(id, { retry: 0, enabled: isRecycler });

    const productList = safeList(products);
    const requirementList = safeList(requirements);
    const wasteList = safeList(wastes);
    const mfgList = safeList(mfgProcesses);
    const recycleList = isRecycler ? safeList(recycleProcesses) : [];

    // State to manage the active selection in the filter ribbon
    const [activeTab, setActiveTab] = useState<TabType>('products');

    if (isLoading || !user) return <View style={styles.screen} />;

    // Helper to dynamically build active tab headers with counts
    const tabs = [
        { id: 'products', label: 'Products', count: productList.length },
        { id: 'requirements', label: 'Requirements', count: requirementList.length },
        { id: 'waste', label: 'Waste', count: wasteList.length },
        { id: 'recycling', label: 'Recycling', count: recycleList.length },
        { id: 'mfg', label: 'Processes', count: mfgList.length },
    ] as const;

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Account Details</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Profile Info & Sticky Ribbon controls remain interactive */}
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                
                {/* 1. Nice Profile Card with All Available Details */}
                <View style={styles.profileCard}>
                    <AvatarRow
                        firstName={user.first_name}
                        lastName={user.last_name}
                        role={user.designation || 'Member'}
                        company={user.company_name || 'Independent'}
                    />
                    
                    {/* Secondary details divider & fields below metadata */}
                    {(user.email || user.address || user.username) && (
                        <View style={styles.detailsContainer}>
                            {user.email && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Email</Text>
                                    <Text style={styles.detailValue} numberOfLines={1}>{user.email}</Text>
                                </View>
                            )}
                            {user.address && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Address</Text>
                                    <Text style={styles.detailValue} numberOfLines={2}>{user.address}</Text>
                                </View>
                            )}
                            {user.username && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>ID Reference</Text>
                                    <Text style={styles.detailValue}>@{user.username}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* 2. Horizontal Filter Ribbon */}
                <View style={styles.ribbonWrapper}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.ribbonContainer}
                    >
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <TouchableOpacity
                                    key={tab.id}
                                    style={[styles.ribbonTab, isActive && styles.ribbonTabActive]}
                                    onPress={() => setActiveTab(tab.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.ribbonText, isActive && styles.ribbonTextActive]}>
                                        {tab.label} {tab.count > 0 ? `(${tab.count})` : ''}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* 3. List Container (Renders active category exclusively) */}
                <View style={styles.listContainer}>
                    
                    {activeTab === 'products' && (
                        <View style={styles.tabContent}>
                            {productList.length > 0 ? (
                                productList.map((p: any) => (
                                    <ProductCard key={p.id} item={p} onPress={() => router.push(`/screens/product/${p.id}`)} />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No products listed by this user.</Text>
                            )}
                        </View>
                    )}

                    {activeTab === 'requirements' && (
                        <View style={styles.tabContent}>
                            {requirementList.length > 0 ? (
                                requirementList.map((r: any) => (
                                    <RequirementCard key={r.id} item={r} onPress={() => router.push(`/screens/requirement/${r.id}`)} />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No requirements listed by this user.</Text>
                            )}
                        </View>
                    )}

                    {activeTab === 'waste' && (
                        <View style={styles.tabContent}>
                            {wasteList.length > 0 ? (
                                wasteList.map((w: any) => (
                                    <WasteCard key={w.id} item={w} onPress={() => router.push(`/screens/waste/${w.id}`)} />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No waste assets listed by this user.</Text>
                            )}
                        </View>
                    )}

                    {activeTab === 'recycling' && (
                        <View style={styles.tabContent}>
                            {recycleList.length > 0 ? (
                                recycleList.map((rp: any) => (
                                    <RecyclingCard key={rp.id} item={rp} onPress={() => router.push(`/screens/recycling/${rp.id}` as any)} />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No recycling services registered.</Text>
                            )}
                        </View>
                    )}

                    {activeTab === 'mfg' && (
                        <View style={styles.tabContent}>
                            {mfgList.length > 0 ? (
                                mfgList.map((mp: any) => (
                                    <TouchableOpacity
                                        key={mp.id}
                                        style={styles.mfgRow}
                                        onPress={() => router.push(`/screens/mfg_process/${mp.id}` as any)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.mfgName}>{mp.manufacturing_process_name}</Text>
                                        <Text style={styles.mfgArrow}>›</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No manufacturing processes registered.</Text>
                            )}
                        </View>
                    )}

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: layout.screenPadH, 
        paddingTop: 56, 
        paddingBottom: 16 
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    back: { fontSize: 32, color: colors.black, fontWeight: '300' },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    
    scroll: { paddingBottom: 60, gap: 16 },
    
    // Premium Solid Green Card mimicking Natasha's card in your mockups
    profileCard: { 
        backgroundColor: colors.primary || '#74C044', 
        marginHorizontal: layout.screenPadH,
        borderRadius: radius.xl || 16, 
        padding: 20,
        gap: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    detailsContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.25)',
        paddingTop: 14,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontFamily: typography.bodyMed,
        fontSize: fontSize.xs,
        color: 'rgba(255, 255, 255, 0.7)',
        width: '30%',
    },
    detailValue: {
        fontFamily: typography.body,
        fontSize: fontSize.xs,
        color: colors.white,
        textAlign: 'right',
        width: '70%',
    },

    // Horizontal Filter Ribbon Controls
    ribbonWrapper: {
        marginVertical: 4,
    },
    ribbonContainer: {
        paddingHorizontal: layout.screenPadH,
        gap: 10,
    },
    ribbonTab: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: radius.pill || 20,
        backgroundColor: colors.white,
        borderWidth: card.borderWidth,
        borderColor: card.border,
    },
    ribbonTabActive: {
        backgroundColor: colors.primary || '#74C044',
        borderColor: colors.primary || '#74C044',
    },
    ribbonText: {
        fontFamily: typography.bodyMed,
        fontSize: fontSize.sm,
        color: colors.black,
    },
    ribbonTextActive: {
        color: colors.white,
    },

    // Content layouts
    listContainer: {
        paddingHorizontal: layout.screenPadH,
    },
    tabContent: {
        gap: 12,
    },
    mfgRow: { 
        backgroundColor: card.bg, 
        borderRadius: card.radius, 
        borderWidth: card.borderWidth, 
        borderColor: card.border, 
        padding: 16, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mfgName: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    mfgArrow: { fontSize: 20, color: colors.body, fontWeight: '300' },
    
    emptyText: { 
        fontFamily: typography.body, 
        fontSize: fontSize.sm, 
        color: colors.body, 
        textAlign: 'center', 
        paddingVertical: 40 
    },
});