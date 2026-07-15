import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appBg, card, colors, fontSize, layout, typography } from '../../../constants/theme';
import { useSystemDefaultProcesses } from '../../../hooks/useManufacturingProcesses';

export default function MfgProcessIndexScreen() {
    const router = useRouter();
    const { data: processes = [] } = useSystemDefaultProcesses();

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
                <Text style={styles.title}>Manufacturing Processes</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={processes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/screens/mfg_process/${item.id}` as any)}>
                        <Text style={styles.itemName}>{item.manufacturing_process_name}</Text>
                        {item.manufacturing_process_desc && (
                            <Text style={styles.itemDesc} numberOfLines={2}>{item.manufacturing_process_desc}</Text>
                        )}
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
    itemName: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black },
    itemDesc: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
});