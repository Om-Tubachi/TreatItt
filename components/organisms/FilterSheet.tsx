import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { appBg, card, colors, fontSize, radius, spacing, typography } from '../../constants/theme';
import { EntityType, MetricFilter, useFilters } from '../../context/filter';
import { getTemplatesFor, useFormTemplates } from '../../hooks/useFormTemplates';
import { useFrp } from '../../hooks/useFrp';

interface Props {
  visible: boolean;
  onClose: () => void;
  showActorLayer?: boolean; // top layer for actor toggles — map/discover only, hidden on Marketplace
  showDistanceSlider?: boolean; // radius presets — map/discover only
}

// maps our EntityType values to the strings stored in form_templates.applies_to
const ENTITY_SCHEMA_KEY: Record<EntityType, string> = {
  product: 'product',
  waste: 'waste',
  requirement: 'requirement',
  recycling: 'recycling', // not backed by form_templates — see note below
};

const ACTOR_LABELS: Record<EntityType, string> = {
  product: 'Product Owner',
  waste: 'Waste Producer',
  requirement: 'Consumer',
  recycling: 'Recycler',
};

const RADIUS_PRESETS = [1, 5, 10, 25];

export function FilterSheet({ visible, onClose, showActorLayer = false, showDistanceSlider = false }: Props) {
  const { filters, setActorTypes, setNear, setLayer2, setMetric, setRecency, resetFilters, activeFilterCount } =
    useFilters();
  const { data: frpLookups } = useFrp();
  const { data: templates } = useFormTemplates();

  // staged locally so typing into a range input doesn't refire a search request
  // on every keystroke — committed into FilterContext when the sheet closes
  const [localMetrics, setLocalMetrics] = useState<Record<string, MetricFilter>>(filters.metrics);

  const applicableTemplates = useMemo(() => {
    // recycling's filter schema lives on treatment_methods, not form_templates —
    // wire this branch in once the recycling metrics UI is scoped
    if (filters.entityTypes.includes('recycling')) return [];
    return filters.entityTypes.flatMap((t) => getTemplatesFor(templates, ENTITY_SCHEMA_KEY[t]));
  }, [templates, filters.entityTypes]);

  const metricFields = useMemo(() => {
    const seen = new Set<string>();
    const fields: any[] = [];
    applicableTemplates.forEach((t) => {
      (t.metrics_schema || []).forEach((f: any) => {
        if (f.filterable && !seen.has(f.key)) {
          seen.add(f.key);
          fields.push(f);
        }
      });
    });
    return fields;
  }, [applicableTemplates]);

  const handleClose = () => {
    Object.entries(localMetrics).forEach(([key, value]) => setMetric(key, value));
    Object.keys(filters.metrics).forEach((key) => {
      if (!(key in localMetrics)) setMetric(key, undefined);
    });
    onClose();
  };

  const toggleActor = (type: EntityType) => {
    const current = filters.entityTypes;
    const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];
    setActorTypes(next);
  };

  const toggleChip = (field: 'categoryId' | 'compositionId' | 'gradeId' | 'resinId', id: string) => {
    const current = filters[field];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setLayer2(field, next);
  };

  const updateLocalRange = (key: string, bound: 'min' | 'max', raw: string) => {
    const num = raw === '' ? undefined : Number(raw);
    setLocalMetrics((prev) => ({ ...prev, [key]: { ...prev[key], [bound]: num } }));
  };

  const renderChipGroup = (
    label: string,
    entries: Record<string, { id: string; label: string }> | undefined,
    field: 'categoryId' | 'compositionId' | 'gradeId' | 'resinId'
  ) => {
    const values = Object.values(entries ?? {});
    if (!values.length) return null;
    return (
      <>
        <Text style={styles.sectionLabel}>{label}</Text>
        <View style={styles.chipRow}>
          {values.map((item) => {
            const active = filters[field].includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleChip(field, item.id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.reset}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {showActorLayer && (
              <>
                <Text style={styles.sectionLabel}>SHOW ON MAP</Text>
                <View style={styles.chipRow}>
                  {(Object.keys(ACTOR_LABELS) as EntityType[]).map((type) => {
                    const active = filters.entityTypes.includes(type);
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => toggleActor(type)}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{ACTOR_LABELS[type]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {showDistanceSlider && (
              <>
                <Text style={styles.sectionLabel}>DISTANCE</Text>
                <View style={styles.chipRow}>
                  {RADIUS_PRESETS.map((km) => {
                    const active = filters.near?.radiusKm === km;
                    return (
                      <TouchableOpacity
                        key={km}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => setNear(active ? null : { radiusKm: km })}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{km} km</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {renderChipGroup('CATEGORY', frpLookups?.categories, 'categoryId')}
            {renderChipGroup('COMPOSITION', frpLookups?.compositions, 'compositionId')}
            {renderChipGroup('GRADE', frpLookups?.grades, 'gradeId')}
            {renderChipGroup('RESIN', frpLookups?.resins, 'resinId')}

            {metricFields.length > 0 && <Text style={styles.sectionLabel}>METRICS</Text>}
            {metricFields.map((field) => (
              <View key={field.key} style={styles.metricRow}>
                <Text style={styles.metricLabel}>
                  {field.label}
                  {field.unit ? ` (${field.unit})` : ''}
                </Text>
                <View style={styles.rangeRow}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Min"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                    value={localMetrics[field.key]?.min?.toString() ?? ''}
                    onChangeText={(v) => updateLocalRange(field.key, 'min', v)}
                  />
                  <Text style={styles.rangeDash}>–</Text>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Max"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                    value={localMetrics[field.key]?.max?.toString() ?? ''}
                    onChangeText={(v) => updateLocalRange(field.key, 'max', v)}
                  />
                </View>
              </View>
            ))}

            <Text style={styles.sectionLabel}>SORT</Text>
            <View style={styles.chipRow}>
              {(['newest', 'oldest'] as const).map((s) => {
                const active = filters.recency.sort === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setRecency({ ...filters.recency, sort: s })}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {s === 'newest' ? 'Newest' : 'Oldest'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.applyBtn} onPress={handleClose}>
            <Text style={styles.applyBtnText}>Show results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: appBg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, maxHeight: '85%' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontFamily: typography.heading, fontSize: fontSize.lg, color: colors.black },
  reset: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.primaryDark },
  sectionLabel: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: spacing.lg, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary, backgroundColor: card.bg },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
  chipTextActive: { color: colors.white },
  metricRow: { marginBottom: spacing.md },
  metricLabel: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black, marginBottom: spacing.xs },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rangeInput: { flex: 1, backgroundColor: card.bg, borderWidth: card.borderWidth, borderColor: card.border, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8, fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
  rangeDash: { color: colors.body },
  applyBtn: { backgroundColor: colors.primaryDark, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: spacing.lg },
  applyBtnText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.white },
});