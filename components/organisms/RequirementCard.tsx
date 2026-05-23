import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { card, colors, fontSize, typography } from '../../constants/theme';
import { RequirementEntity } from '../../types/entities';
import { Badge } from '../atoms/Badge';
import { AvatarRow } from '../molecules/AvatarRow';
import { FrpPills } from '../molecules/FrpPills';
import { StatBox } from '../molecules/StatBox';

interface Props { item: RequirementEntity; }

export const RequirementCard: React.FC<Props> = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.headerRow}>
            <Text style={styles.typeLabel}>REQUIREMENT</Text>
            <View style={styles.badges}>
                {item.urgency && <Badge label={item.urgency} variant={item.urgency.toLowerCase() === 'urgent' ? 'urgent' : 'outlined'} />}
                {item.status && <Badge label={item.status} variant="accepting" />}
            </View>
        </View>

        <FrpPills frp={item.frp} row />

        <View style={styles.statsRow}>
            <StatBox label="EST REQ/MONTH" value={item.est_req_per_month ? `${item.est_req_per_month} kg` : '—'} />
            <View style={{ width: 8 }} />
            <StatBox label="ACT REQ/MONTH" value={item.act_req_per_month ? `${item.act_req_per_month} kg` : '—'} />
        </View>

        <View>
            <Text style={styles.priceLabel}>PRICE / KG</Text>
            <Text style={styles.price}>₹{item.price_per_kg ?? '—'}</Text>
        </View>

        <AvatarRow
            firstName={item.users?.first_name}
            lastName={item.users?.last_name}
            company={item.users?.company_name}
        />
    </View>
);

const styles = StyleSheet.create({
    card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, gap: 12, marginBottom: 12 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    typeLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 1 },
    badges: { flexDirection: 'row', gap: 6 },
    statsRow: { flexDirection: 'row' },
    priceLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8 },
    price: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.primaryDark },
});