import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OwnershipTabs } from '../../../components/molecules/OwnershipTabs';
import { RecyclingCard } from '../../../components/organisms/RecyclingCard';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useOwnershipTabs } from '../../../hooks/useOwnershipTabs';
import { useAllRecyclerProcesses } from '../../../hooks/useRecyclerProcesses';

export default function RecyclingIndexScreen() {
    const router = useRouter();
    const { data: processes, isLoading, isError } = useAllRecyclerProcesses();
    const { tab, setTab, filtered } = useOwnershipTabs(processes as any[] | undefined);

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Recycling Services</Text>
                <View style={{ width: 40 }} />
            </View>

            <OwnershipTabs tab={tab} onChange={setTab} allLabel="All Recycling Services" mineLabel="My Recycling Services" />

            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : isError ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Failed to load recycling services.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {filtered.length > 0 ? (
                        filtered.map((process: any) => (
                            <RecyclingCard
                                key={process.id}
                                item={process}
                                onPress={() => router.push({ pathname: '/screens/recycling/[id]', params: { id: process.id } })}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recycling services found.</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    back: { fontSize: 32, color: colors.black, fontWeight: '300' },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    scrollContainer: { paddingHorizontal: layout.screenPadH, paddingBottom: 40, gap: 12 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: layout.screenPadH },
    errorText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: '#D9383A', textAlign: 'center' },
    emptyContainer: { paddingTop: 60, alignItems: 'center' },
    emptyText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, textAlign: 'center' },
});