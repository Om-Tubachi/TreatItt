import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { card, colors, fontSize, spacing, typography } from '../../constants/theme';
import { RecyclingEntity } from '../../types/entities';
import { Badge } from '../atoms/Badge';

interface Props {
    item: RecyclingEntity;
}

export const RecyclingCard: React.FC<Props> = ({ item }) => {
    const method = item.treatments?.treatment_processes?.treatment_methods?.method ?? '';
    const process = item.treatments?.treatment_processes?.process ?? '';

    return (
        <View style={styles.card}>
            {/* Absolute Status Tracking Tag */}
            <View style={styles.statusContainer}>
                <Badge label="AVAILABLE" variant="available" />
            </View>

            <View style={styles.content}>
                {/* Header Information Grouping */}
                <View style={styles.headerBlock}>
                    <Text style={styles.typeLabel}>RECYCLING SERVICE</Text>
                    <Text style={styles.title} numberOfLines={1}>
                        {method || 'Standard Treatment'}
                    </Text>
                    {process ? (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            Process Run: {process.toLowerCase()}
                        </Text>
                    ) : null}
                </View>

                <View style={styles.divider} />

                {/* Triple Column Footprint Elements */}
                <View style={styles.footerRow}>
                    <View style={styles.statGroup}>
                        <Text style={styles.statLabel}>CHARGES / KG</Text>
                        <Text style={styles.price}>
                            {item.charges ? `₹${item.charges}` : '—'}
                        </Text>
                    </View>

                    <View style={[styles.statGroup, { alignItems: 'center' }]}>
                        <Text style={styles.statLabel}>CAPACITY</Text>
                        <Text style={styles.statVal}>
                            {item.capacity_kg ? `${item.capacity_kg} kg` : '—'}
                        </Text>
                    </View>

                    <View style={[styles.statGroup, { alignItems: 'flex-end' }]}>
                        <Text style={styles.statLabel}>SCHEDULES</Text>
                        <Text style={styles.date} numberOfLines={1}>
                            {item.schedules ?? '—'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        backgroundColor: card.bg,
        borderRadius: card.radius,
        borderWidth: card.borderWidth,
        borderColor: card.border,
        padding: card.padding,
        marginBottom: spacing.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    content: {
        flex: 1,
    },
    statusContainer: {
        position: 'absolute',
        top: 12,
        right: 14,
        zIndex: 10,
    },
    headerBlock: {
        paddingRight: '32%',
        marginBottom: 4,
    },
    typeLabel: {
        fontFamily: typography.body,
        fontSize: 8.5,
        color: colors.placeholder,
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    title: {
        fontFamily: typography.heading,
        fontSize: fontSize.sm,
        color: colors.black,
        lineHeight: 18,
    },
    subtitle: {
        fontFamily: typography.bodyMed,
        fontSize: 10.5,
        color: colors.body,
        marginTop: 2,
    },
    divider: {
        height: 0.5,
        backgroundColor: card.border,
        marginVertical: 8,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    statGroup: {
        flex: 1,
    },
    statLabel: {
        fontFamily: typography.body,
        fontSize: 9,
        color: colors.placeholder,
        textTransform: 'uppercase',
        marginBottom: 1,
    },
    price: {
        fontFamily: typography.heading,
        fontSize: fontSize.md,
        color: colors.primaryDark,
    },
    statVal: {
        fontFamily: typography.bodyMed,
        fontSize: fontSize.xs,
        color: colors.black,
    },
    date: {
        fontFamily: typography.body,
        fontSize: fontSize.xs,
        color: colors.body,
    },
});