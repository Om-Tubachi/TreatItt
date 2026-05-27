// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Added TouchableOpacity
// import { card, colors, fontSize, typography } from '../../constants/theme';
// import { FrpShape, ProductEntity } from '../../types/entities';
// import { FrpPills } from '../molecules/FrpPills';

// // Define onPress directly inside your component Props
// interface Props {
//     item: ProductEntity;
//     onPress: () => void;
// }

// const buildTitle = (frp?: FrpShape) =>
//     [frp?.composition?.composition_name, frp?.category?.category_name,
//     frp?.grade?.grade_name, frp?.resin?.resin_name].filter(Boolean).join(' · ') || '—';

// const fmtDate = (d?: string) =>
//     d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

// export const ProductCard: React.FC<Props> = ({ item, onPress }) => (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
//         <View style={styles.imgBox} />
//         <View style={styles.content}>
//             <View style={styles.topRow}>
//                 <Text style={styles.title} numberOfLines={2}>{buildTitle(item.frp)}</Text>
//                 <Text style={styles.soldBy}>SOLD BY: {item.users?.username?.toUpperCase()}</Text>
//             </View>
//             {item.form && <Text style={styles.form}>{item.form}</Text>}
//             <FrpPills frp={item.frp} />
//             <View style={styles.statsRow}>
//                 <View>
//                     <Text style={styles.statLabel}>PRICE</Text>
//                     <Text style={styles.price}>₹{item.price ?? '—'}</Text>
//                 </View>
//                 <View style={{ alignItems: 'flex-end' }}>
//                     <Text style={styles.statLabel}>QTY</Text>
//                     <Text style={styles.statVal}>{item.quantity ?? '—'} kg</Text>
//                 </View>
//             </View>
//             <Text style={styles.date}>{fmtDate(item.date)}</Text>
//         </View>
//     </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//     card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, flexDirection: 'row', padding: card.padding, gap: 12, marginBottom: 12 },
//     imgBox: { width: 110, borderRadius: 10, backgroundColor: '#F1FEE4' },
//     content: { flex: 1, gap: 6 },
//     topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//     title: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black, flex: 1, marginRight: 6 },
//     soldBy: { fontFamily: typography.body, fontSize: 9, color: colors.body },
//     form: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
//     statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
//     statLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase' },
//     price: { fontFamily: typography.heading, fontSize: fontSize.lg, color: colors.primaryDark },
//     statVal: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
//     date: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textAlign: 'right' },
// });

import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { card, colors, fontSize, spacing, typography } from '../../constants/theme';
import { ProductEntity } from '../../types/entities';
import { FrpPills } from '../molecules/FrpPills';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
    item: ProductEntity;
    onPress: () => void;
}

const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

export const ProductCard: React.FC<Props> = ({ item, onPress }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = (e: any) => {
        e.stopPropagation(); 
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    // Split the 4 properties cleanly into a hierarchy instead of one long dot-separated mess
    const primaryTitle = [item.frp?.composition?.composition_name, item.frp?.category?.category_name]
        .filter(Boolean)
        .join(' ') || 'FRP Material';

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

            <View style={styles.imgBox} />
            
            <View style={styles.content}>
                {/* Header Section: All 4 Data Points split logically for scannability */}
                <View style={styles.headerBlock}>
                    <Text style={styles.title} numberOfLines={1}>
                        {primaryTitle}
                    </Text>
                    {secondaryTitle ? (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {secondaryTitle}
                        </Text>
                    ) : null}
                </View>

                {item.form && <Text style={styles.form}>{item.form}</Text>}
                
                {/* Collapsible Specs Container */}
                <View style={styles.specificationsContainer}>
                    <TouchableOpacity 
                        onPress={toggleExpand} 
                        style={styles.toggleBtn}
                        activeOpacity={0.6}
                    >
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
                        <Text style={styles.statLabel}>PRICE</Text>
                        <Text style={styles.price}>₹{item.price ?? '—'}</Text>
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
        minHeight: 105, // Slight bump to gracefully account for the extra title layer
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
        // Keeps dynamic title elements clear from wrapping underneath the isolated seller text
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
    form: { 
        fontFamily: typography.body, 
        fontSize: fontSize.xs, 
        color: colors.placeholder, // Slight color adjustment to separate it visually from the subtitle
        marginTop: 2,
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