import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { card, colors, fontSize, spacing, typography } from '../../constants/theme';
import { findTemplateById, useFormTemplates } from '../../hooks/useFormTemplates';
import { RequirementEntity } from '../../types/entities';
import { formatRangeMetrics } from '../../utils/formatMetrics';
import { Badge } from '../atoms/Badge';
import { FrpPills } from '../molecules/FrpPills';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
    item: RequirementEntity;
    onPress: () => void;
    onUserPress?: () => void;
}

export const RequirementCard: React.FC<Props> = ({ item, onPress, onUserPress }) => {
    const [expanded, setExpanded] = useState(false);
    const { data: templates } = useFormTemplates();

    const template = findTemplateById(templates, item.form_template_id ?? undefined);
    const formattedMetrics = formatRangeMetrics(item.metrics_range, template?.metrics_schema);

    const toggleExpand = (e: any) => {
        e.stopPropagation();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const primaryTitle = [item.frp?.composition?.composition_name, item.frp?.category?.category_name]
        .filter(Boolean)
        .join(' ') || 'FRP Requirement';

    const secondaryTitle = [item.frp?.grade?.grade_name, item.frp?.resin?.resin_name]
        .filter(Boolean)
        .join(' · ');

    const userCompany = item.users?.company_name || `${item.users?.first_name || ''} ${item.users?.last_name || ''}`.trim();

    const hasExpandableContent = formattedMetrics.length > 0 || !!item.frp?.composition;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.topRightContainer}>
                {item.urgency && (
                    <Badge label={item.urgency.toUpperCase()} variant={item.urgency.toLowerCase() === 'urgent' ? 'urgent' : 'outlined'} />
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.headerBlock}>
                    <Text style={styles.typeLabel}>REQUIREMENT</Text>
                    <Text style={styles.title} numberOfLines={1}>{primaryTitle}</Text>
                    {secondaryTitle ? <Text style={styles.subtitle} numberOfLines={1}>{secondaryTitle}</Text> : null}
                    {userCompany ? (
                        <TouchableOpacity onPress={(e: any) => { e.stopPropagation(); onUserPress?.(); }} disabled={!onUserPress}>
                            <Text style={styles.companyText} numberOfLines={1}>BY: {userCompany.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ) : null}
                    {template && <Text style={styles.templateLabel}>{template.form_name}</Text>}
                </View>

                {hasExpandableContent && (
                    <View style={styles.specificationsContainer}>
                        <TouchableOpacity onPress={toggleExpand} style={styles.toggleBtn} activeOpacity={0.6}>
                            <Text style={styles.toggleText}>{expanded ? 'Hide Specs ▲' : '+ Specs ▼'}</Text>
                        </TouchableOpacity>

                        <FrpPills frp={item.frp} expanded={expanded} />

                        {expanded && formattedMetrics.length > 0 && (
                            <View style={styles.metricsBox}>
                                {formattedMetrics.map((m, i) => (
                                    <View key={i} style={styles.metricRow}>
                                        <Text style={styles.metricLabel}>{m.label}</Text>
                                        <Text style={styles.metricValue}>{m.value}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.divider} />

                <View style={styles.footerRow}>
                    <View style={styles.statGroup}>
                        <Text style={styles.statLabel}>PRICE / KG</Text>
                        <Text style={styles.price}>₹{item.price_per_kg ?? '—'}</Text>
                    </View>
                    <View style={[styles.statGroup, { alignItems: 'center' }]}>
                        <Text style={styles.statLabel}>EST / MONTH</Text>
                        <Text style={styles.statVal}>{item.est_req_per_month ? `${item.est_req_per_month} kg` : '—'}</Text>
                    </View>
                    <View style={[styles.statGroup, { alignItems: 'flex-end' }]}>
                        <Text style={styles.statLabel}>ACT / MONTH</Text>
                        <Text style={styles.statVal}>{item.act_req_per_month ? `${item.act_req_per_month} kg` : '—'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { position: 'relative', backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, marginBottom: spacing.md, shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    content: { flex: 1 },
    topRightContainer: { position: 'absolute', top: 12, right: 14, zIndex: 10, flexDirection: 'row', gap: 6 },
    headerBlock: { paddingRight: '30%', marginBottom: 2 },
    typeLabel: { fontFamily: typography.body, fontSize: 8.5, color: colors.placeholder, letterSpacing: 0.8, marginBottom: 2 },
    title: { fontFamily: typography.heading, fontSize: fontSize.sm, color: colors.black, lineHeight: 18 },
    subtitle: { fontFamily: typography.bodyMed, fontSize: 10.5, color: colors.body, marginTop: 1 },
    companyText: { fontFamily: typography.body, fontSize: 8.5, color: colors.body, marginTop: 2 },
    templateLabel: { fontFamily: typography.body, fontSize: 9, color: colors.primaryDark, marginTop: 2 },
    specificationsContainer: { alignItems: 'flex-start', marginTop: 6, marginBottom: 2, width: '100%' },
    toggleBtn: { paddingVertical: 3, paddingHorizontal: 8, backgroundColor: colors.inputBg, borderRadius: 4, borderWidth: 0.5, borderColor: card.border },
    toggleText: { fontFamily: typography.bodyMed, fontSize: 9, color: colors.body },
    metricsBox: { width: '100%', marginTop: 6, backgroundColor: colors.inputBg, borderRadius: 6, padding: 8, gap: 4 },
    metricRow: { flexDirection: 'row', justifyContent: 'space-between' },
    metricLabel: { fontFamily: typography.body, fontSize: 10, color: colors.body },
    metricValue: { fontFamily: typography.bodyMed, fontSize: 10, color: colors.black },
    divider: { height: 0.5, backgroundColor: card.border, marginVertical: 6 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    statGroup: { flex: 1 },
    statLabel: { fontFamily: typography.body, fontSize: 9, color: colors.placeholder, textTransform: 'uppercase', marginBottom: 1 },
    price: { fontFamily: typography.heading, fontSize: fontSize.md, color: colors.primaryDark },
    statVal: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.black },
});