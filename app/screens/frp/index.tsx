import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FrpPills } from '../../../components/molecules/FrpPills';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useFrp } from '../../../hooks/useFrp';

export default function FrpIndexScreen() {
    const router = useRouter();
    const { data: frpList = [], isLoading } = useFrp();

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>FRP Materials</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={frpList}
                keyExtractor={(i: any) => i.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }: any) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/screens/frp/${item.id}`)}>
                        <FrpPills frp={item} row />
                        {item.description && <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>}
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
    desc: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
});