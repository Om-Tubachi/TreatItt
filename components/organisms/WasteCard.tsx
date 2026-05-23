import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { card, colors, fontSize, typography } from '../../constants/theme';
import { WasteEntity } from '../../types/entities';
import { Badge } from '../atoms/Badge';
import { FrpPills } from '../molecules/FrpPills';

interface Props { item: WasteEntity; }

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

export const WasteCard: React.FC<Props> = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.topRow}>
            <Text style={styles.location}>📍 —</Text>
            <Text style={styles.soldBy}>SOLD BY: {item.users?.username?.toUpperCase()}</Text>
        </View>
        <View style={styles.body}>
            <View style={styles.imgBox} />
            <View style={styles.content}>
                <FrpPills frp={item.frp} />
                <View style={styles.badgeRow}>
                    {item.lifecycle_stage && <Badge label={item.lifecycle_stage} variant="amber" />}
                    {item.form && <Text style={styles.form}>form: {item.form}</Text>}
                </View>
                <Text style={styles.statLabel}>QTY</Text>
                <Text style={styles.qty}>{item.quantity ?? '—'} kg</Text>
                <Text style={styles.priceRow}>price / kg  ₹{item.price_per_kg ?? '—'}</Text>
                <Text style={styles.date}>{fmtDate(item.date)}</Text>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 10, marginBottom: 12 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between' },
    location: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    soldBy: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    body: { flexDirection: 'row', gap: 12 },
    imgBox: { width: 100, height: 130, borderRadius: 10, backgroundColor: '#F1FEE4' },
    content: { flex: 1, gap: 5 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    form: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    statLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase' },
    qty: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black },
    priceRow: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
    date: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textAlign: 'right' },
});