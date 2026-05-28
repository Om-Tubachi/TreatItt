import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DetailSheet } from '../../../components/layout/DetailSheet';
import { SectionHeader } from '../../../components/molecules/SectionHeader';
import { appBg, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFrp } from '../../../hooks/useFrp';

export default function FrpDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { data: lookups } = useFrp();

    // Pull the matching element context from the exact structured lookup bucket
    const currentCategory = lookups?.categories[id];

    if (!currentCategory) return <View style={styles.screen} />;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>FRP Detail</Text>
                <View style={{ width: 24 }} />
            </View>
            <DetailSheet>
                <SectionHeader title="Category" />
                <View style={styles.pillContainer}>
                     <Text style={styles.pillText}>{currentCategory.label}</Text>
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
    pillContainer: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', marginTop: 8 },
    pillText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.primary }
});