import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useAllTreatmentMethods } from '../../../hooks/useTreatmentMethods';

export default function TreatmentMethodsScreen() {
    const router = useRouter();
    const { data: methods = [] } = useAllTreatmentMethods();

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Treatment Methods</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={methods}
                keyExtractor={(i: any) => i.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }: any) => (
                    <View style={styles.card}>
                        <Text style={styles.method}>{item.method}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 16 },
    back: { fontSize: 28, color: colors.black, marginRight: 8 },
    title: { flex: 1, textAlign: 'center', fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    list: { padding: layout.screenPadH, gap: 12 },
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding },
    method: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
});