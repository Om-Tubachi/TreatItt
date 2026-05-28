import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFrp } from '../../../hooks/useFrp';

export default function FrpIndexScreen() {
    const router = useRouter();
    // useFrp now returns a Lookups object containing dictionary maps
    const { data: lookups, isLoading } = useFrp();

    // Map the lookup category map into an array for the FlatList
    const categoriesArray = lookups ? Object.values(lookups.categories) : [];

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>FRP Materials</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={categoriesArray}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    // Passing item.id downstream so details can pick it up
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/screens/frp/${item.id}`)}>
                        {/* Adapt standard components to expect atom properties if required */}
                        <Text style={styles.itemName}>{item.label}</Text>
                    </TouchableOpacity>
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
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 8 },
    itemName: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black }
});