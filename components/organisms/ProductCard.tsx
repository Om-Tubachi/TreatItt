import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { card, colors, fontSize, typography } from '../../constants/theme';
import { FrpShape, ProductEntity } from '../../types/entities';
import { FrpPills } from '../molecules/FrpPills';

interface Props { item: ProductEntity; }

const buildTitle = (frp?: FrpShape) =>
    [frp?.composition?.composition_name, frp?.category?.category_name,
    frp?.grade?.grade_name, frp?.resin?.resin_name].filter(Boolean).join(' · ') || '—';

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

export const ProductCard: React.FC<Props> = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.imgBox} />
        <View style={styles.content}>
            <View style={styles.topRow}>
                <Text style={styles.title} numberOfLines={2}>{buildTitle(item.frp)}</Text>
                <Text style={styles.soldBy}>SOLD BY: {item.users?.username?.toUpperCase()}</Text>
            </View>
            {item.form && <Text style={styles.form}>{item.form}</Text>}
            <FrpPills frp={item.frp} />
            <View style={styles.statsRow}>
                <View>
                    <Text style={styles.statLabel}>PRICE</Text>
                    <Text style={styles.price}>₹{item.price ?? '—'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.statLabel}>QTY</Text>
                    <Text style={styles.statVal}>{item.quantity ?? '—'} kg</Text>
                </View>
            </View>
            <Text style={styles.date}>{fmtDate(item.date)}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, flexDirection: 'row', padding: card.padding, gap: 12, marginBottom: 12 },
    imgBox: { width: 110, borderRadius: 10, backgroundColor: '#F1FEE4' },
    content: { flex: 1, gap: 6 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black, flex: 1, marginRight: 6 },
    soldBy: { fontFamily: typography.body, fontSize: 9, color: colors.body },
    form: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    statLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase' },
    price: { fontFamily: typography.heading, fontSize: fontSize.lg, color: colors.primaryDark },
    statVal: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    date: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textAlign: 'right' },
});