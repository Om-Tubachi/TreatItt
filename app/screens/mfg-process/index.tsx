import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useManufacturingProcesses } from '../../../hooks/useManufacturingProcesses';

export default function MfgProcessIndexScreen() {
    const router = useRouter();
    const { data: processes = [] } = useManufacturingProcesses();

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Manufacturing Processes</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={processes}
                keyExtractor={(i: any) => i.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }: any) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/screens/mfg-process/${item.id}`)}>
                        <Text style={styles.name}>{item.manufacturing_process_name}</Text>
                        {item.manufacturing_process_desc && <Text style={styles.desc} numberOfLines={2}>{item.manufacturing_process_desc}</Text>}
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
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 6 },
    name: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    desc: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
});