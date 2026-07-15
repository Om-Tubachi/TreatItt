// app/screens/frp/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFrp } from '../../../hooks/useFrp';

export default function FrpIndexScreen() {
    const router = useRouter();
    const { data: lookups, isLoading } = useFrp();

    const compositionsArray = lookups ? Object.values(lookups.compositions) : [];

    // count of frp rows under each composition, computed from real rawEntries, no hardcoding
    const countFor = (compositionId: string) =>
        lookups?.rawEntries.filter(e => e.composition_id === compositionId).length ?? 0;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>FRP Materials</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={compositionsArray}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const count = countFor(item.id);
                    return (
                        <TouchableOpacity style={styles.card} onPress={() => router.push(`/screens/frp/${item.id}`)}>
                            <Text style={styles.itemName}>{item.label}</Text>
                            {count > 0 && (
                                <Text style={styles.itemMeta}>Active in {count} formulation{count === 1 ? '' : 's'}</Text>
                            )}
                        </TouchableOpacity>
                    );
                }}
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
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 4 },
    itemName: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black },
    itemMeta: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
});