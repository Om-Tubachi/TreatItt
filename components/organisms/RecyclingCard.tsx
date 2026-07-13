import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { card, colors, fontSize, spacing, typography } from '../../constants/theme';
import { useFormTemplates } from '../../hooks/useFormTemplates';
import { RecyclingEntity } from '../../types/entities';
import { formatProcessDetails } from '../../utils/processDetailsFormat';
import { formatSchedule } from '../../utils/scheduleFormat';
import { Badge } from '../atoms/Badge';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
    item: RecyclingEntity;
    onPress?: () => void;
}

export const RecyclingCard: React.FC<Props> = ({ item, onPress }) => {
    const [expanded, setExpanded] = useState(false);
    const { data: templates } = useFormTemplates();

    const toggleExpand = (e: any) => {
        e.stopPropagation();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    // Extract structure backed cleanly by your backend relational paths
    const method = item.treatments?.treatment_processes?.treatment_methods?.method ?? '';
    const process = item.treatments?.treatment_processes?.process ?? '';
    const parameterSchema = item.treatments?.treatment_processes?.treatment_methods?.process_parameter_schema;
    
    const formattedDetails = formatProcessDetails(item.process_details, parameterSchema);
    const readableSchedule = formatSchedule(item.schedules);

    // Resolve structural accepted UUID form templates against current cached template array
    const resolvedForms = (item.accepted_form_ids ?? [])
        .map(id => templates?.find(t => t.id === id)?.form_name || null)
        .filter((name): name is string => !!name);

    const hasExpandableContent = 
        formattedDetails.length > 0 || 
        (item.capability_metrics && Object.keys(item.capability_metrics).length > 0) || 
        resolvedForms.length > 0;

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress} 
            disabled={!onPress}
            activeOpacity={0.8}
        >
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

                {/* Collapsible Technical Spec Sub-System */}
                {hasExpandableContent && (
                    <View style={styles.specificationsContainer}>
                        <TouchableOpacity 
                            onPress={toggleExpand} 
                            style={styles.toggleBtn}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.toggleText}>
                                {expanded ? 'Hide Details ▲' : '+ View Process Details ▼'}
                            </Text>
                        </TouchableOpacity>

                        {expanded && (
                            <View style={styles.expandedContent}>
                                {/* Process Schema Metric Rows */}
                                {formattedDetails.map((detail, idx) => (
                                    <View key={idx} style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>{detail.label}</Text>
                                        <Text style={styles.detailValue}>{detail.value}</Text>
                                    </View>
                                ))}

                                {/* Capability Metrics Object Map Rendering */}
                                {item.capability_metrics && Object.keys(item.capability_metrics).length > 0 && (
                                    <View style={styles.metricsContainer}>
                                        <Text style={styles.sectionLabel}>CAPABILITY METRICS</Text>
                                        <View style={styles.pillsWrap}>
                                            {Object.entries(item.capability_metrics).map(([key, val]) => (
                                                <View key={key} style={styles.metricPill}>
                                                    <Text style={styles.pillText}>
                                                        {key.replace(/_/g, ' ')}: {String(val)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Form Templates Array Grouping */}
                                {resolvedForms.length > 0 && (
                                    <View style={styles.formsContainer}>
                                        <Text style={styles.sectionLabel}>ACCEPTED COMPLIANCE FORMS</Text>
                                        <View style={styles.pillsWrap}>
                                            {resolvedForms.map((formName, idx) => (
                                                <View key={idx} style={[styles.metricPill, styles.formPill]}>
                                                    <Text style={[styles.pillText, styles.formPillText]}>
                                                        📄 {formName}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}

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
                            {readableSchedule}
                        </Text>
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
    specificationsContainer: {
        alignItems: 'flex-start',
        marginTop: 8,
        width: '100%',
    },
    toggleBtn: {
        paddingVertical: 4,
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
    expandedContent: {
        width: '100%',
        marginTop: 8,
        backgroundColor: colors.inputBg,
        padding: 8,
        borderRadius: 6,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: card.border,
        paddingVertical: 4,
    },
    detailLabel: {
        fontFamily: typography.body,
        fontSize: 11,
        color: colors.body,
    },
    detailValue: {
        fontFamily: typography.bodyMed,
        fontSize: 11,
        color: colors.black,
    },
    metricsContainer: {
        marginTop: 4,
    },
    formsContainer: {
        marginTop: 4,
    },
    sectionLabel: {
        fontFamily: typography.body,
        fontSize: 8,
        color: colors.placeholder,
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    pillsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    metricPill: {
        backgroundColor: colors.black === '#000000' ? '#FFFFFF' : colors.inputBg,
        borderWidth: 0.5,
        borderColor: card.border,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pillText: {
        fontFamily: typography.body,
        fontSize: 9,
        color: colors.black,
    },
    formPill: {
        backgroundColor: '#EBF5FF',
        borderColor: '#BEE3F8',
    },
    formPillText: {
        color: '#2B6CB0',
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