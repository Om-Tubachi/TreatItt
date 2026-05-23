import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { card, colors, fontSize, typography } from '../../constants/theme';
import { RecyclingEntity } from '../../types/entities';
import { Badge } from '../atoms/Badge';
import { StatBox } from '../molecules/StatBox';

interface Props { item: RecyclingEntity; }

export const RecyclingCard: React.FC<Props> = ({ item }) => {
    const method = item.treatments?.treatment_processes?.treatment_methods?.method ?? '';
    const process = item.treatments?.treatment_processes?.process ?? '';

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.typeLabel}>♻ RECYCLING SERVICE</Text>
                <Badge label="Available" variant="available" />
            </View>
            <Text style={styles.title}>{method || '—'}</Text>
            {(method || process) && (
                <Text style={styles.sub}>method: {method} · process: {process}</Text>
            )}
            <View style={styles.statsRow}>
                <StatBox label="CAPACITY" value={item.capacity_kg ? `${item.capacity_kg} kg` : '—'} />
                <View style={{ width: 8 }} />
                <StatBox label="/KG" value={item.charges ? `${item.charges}` : '—'} />
                <View style={{ width: 8 }} />
                <StatBox label="SCHEDULES" value={item.schedules ?? '—'} />
            </View>
            <View style={styles.divider} />
            {/* AvatarRow: recycler user info not included in current service query — add when extended */}
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 12, marginBottom: 12 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    typeLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8 },
    title: { fontFamily: typography.heading, fontSize: fontSize.md, color: colors.black },
    sub: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    statsRow: { flexDirection: 'row' },
    divider: { height: 1, backgroundColor: card.border },
});