import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { card, colors, fontSize, spacing, typography } from '../../constants/theme';
import { WasteEntity } from '../../types/entities';
import { Badge } from '../atoms/Badge';
import { FrpPills } from '../molecules/FrpPills';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
    item: WasteEntity;
    onPress: () => void;
}

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

export const WasteCard: React.FC<Props> = ({ item, onPress }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = (e: any) => {
        e.stopPropagation();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const primaryTitle = [item.frp?.composition?.composition_name, item.frp?.category?.category_name]
        .filter(Boolean)
        .join(' ') || 'FRP Waste Material';

    const secondaryTitle = [item.frp?.grade?.grade_name, item.frp?.resin?.resin_name]
        .filter(Boolean)
        .join(' · ');

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            {/* Remote Top Right Corner Tag */}
            <View style={styles.soldByContainer}>
                <Text style={styles.soldByText} numberOfLines={1}>
                    SOLD BY: {item.users?.username?.toUpperCase() || 'UNKNOWN'}
                </Text>
            </View>

            <View style={styles.imgBox}>
                <Text style={styles.locationPin}>📍 —</Text>
            </View>

            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.headerBlock}>
                    <Text style={styles.title} numberOfLines={1}>{primaryTitle}</Text>
                    {secondaryTitle ? (
                        <Text style={styles.subtitle} numberOfLines={1}>{secondaryTitle}</Text>
                    ) : null}
                </View>

                <View style={styles.metaRow}>
                    {item.lifecycle_stage && <Badge label={item.lifecycle_stage.toLowerCase()} variant="amber" />}
                    {item.form && <Text style={styles.form}>{item.form.toLowerCase()}</Text>}
                </View>

                {/* Collapsible Specs Container */}
                <View style={styles.specificationsContainer}>
                    <TouchableOpacity onPress={toggleExpand} style={styles.toggleBtn} activeOpacity={0.6}>
                        <Text style={styles.toggleText}>
                            {expanded ? 'Hide Specs ▲' : '+ Specs ▼'}
                        </Text>
                    </TouchableOpacity>
                    <FrpPills frp={item.frp} expanded={expanded} />
                </View>

                <View style={styles.divider} />

                {/* Bottom Stats Row */}
                <View style={styles.footerRow}>
                    <View style={styles.statGroup}>
                        <Text style={styles.statLabel}>PRICE / KG</Text>
                        <Text style={styles.price}>₹{item.price_per_kg ?? '—'}</Text>
                    </View>

                    <View style={[styles.statGroup, { alignItems: 'center' }]}>
                        <Text style={styles.statLabel}>QTY</Text>
                        <Text style={styles.statVal}>{item.quantity ?? '—'} kg</Text>
                    </View>

                    <View style={[styles.statGroup, { alignItems: 'flex-end' }]}>
                        <Text style={styles.statLabel}>LISTED</Text>
                        <Text style={styles.date}>{fmtDate(item.date) || '—'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        backgroundColor: card.bg,
        borderRadius: card.radius,
        borderWidth: card.borderWidth,
        borderColor: card.border,
        flexDirection: 'row',
        padding: card.padding,
        marginBottom: spacing.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    imgBox: {
        width: 85,
        borderRadius: 10,
        backgroundColor: '#F1FEE4',
        alignSelf: 'stretch',
        minHeight: 110,
        position: 'relative',
        padding: 6,
    },
    locationPin: {
        fontSize: 9,
        fontFamily: typography.body,
        color: colors.body,
    },
    content: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
    },
    soldByContainer: {
        position: 'absolute',
        top: 12,
        right: 14,
        zIndex: 10,
        maxWidth: '35%',
    },
    soldByText: {
        fontFamily: typography.heading,
        fontSize: 7.5,
        color: colors.primaryDark,
        letterSpacing: 0.4,
        textDecorationLine: 'underline',
    },
    headerBlock: {
        paddingRight: '38%',
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
        marginTop: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 3,
    },
    form: {
        fontFamily: typography.body,
        fontSize: fontSize.xs,
        color: colors.placeholder,
    },
    specificationsContainer: {
        alignItems: 'flex-start',
        marginTop: 6,
        marginBottom: 2,
    },
    toggleBtn: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        backgroundColor: colors.inputBg,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: card.border,
    },
    toggleText: {
        fontFamily: typography.bodyMed,
        fontSize: 9,
        color: colors.body,
    },
    divider: {
        height: 0.5,
        backgroundColor: card.border,
        marginVertical: 6,
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