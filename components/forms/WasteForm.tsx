import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../constants/theme';
import { FormInput } from '../ui/FormInput';
import { FormPicker } from '../ui/FormPicker';
import { ScreenHeader } from '../ui/ScreenHeader';
import { SubmitButton } from '../ui/SubmitButton';

import { useFrp } from '../../hooks/useFrp';
import { useManufacturingProcesses } from '../../hooks/useManufacturingProcesses';
import { useUpdateWaste, useUploadWaste, useWasteById } from '../../hooks/useWastes';
import { useLocation } from '../../utils/useLocation';

const CONDITIONS = ['Pre-consumer', 'Post-consumer', 'End-of-life'] as const;
type Condition = typeof CONDITIONS[number];

const UNIT_OPTIONS = [
  { label: 'kg', value: 'kg' },
  { label: 'tonnes', value: 't' },
  { label: 'lbs', value: 'lbs' },
];

interface WasteFormProps {
  id?: string;
}

export default function WasteForm({ id }: WasteFormProps) {
  const isEdit = !!id;

  const { data: frpList = [] } = useFrp();
  const { data: mfgList = [] } = useManufacturingProcesses();
  const { data, isLoading } = useWasteById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useUploadWaste();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateWaste();
  const { latitude, longitude, captured, loading: locationLoading, captureLocation } = useLocation();

  const [frpId, setFrpId] = useState('');
  const [manufacturingProcessId, setMfgId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [condition, setCondition] = useState<Condition>('Pre-consumer');
  const [notes, setNotes] = useState('');
  const [collectorId, setCollectorId] = useState('');
  const [lifecycleStage, setLifecycleStage] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [form, setForm] = useState('');

  const isPending = creating || updating;
  const error = createError || updateError;

  useEffect(() => {
    if (data) {
      setFrpId(data.frpId ?? '');
      setMfgId(data.manufacturingProcessId ?? '');
      setQuantity(String(data.quantity ?? ''));
      setCollectorId(data.collectorId ?? '');
      if (data.unit) setUnit(data.unit);
      if (data.condition) setCondition(data.condition);
      if (data.notes) setNotes(data.notes);
      if (data.lifecycleStage) setLifecycleStage(data.lifecycleStage);
      if (data.pricePerKg) setPricePerKg(String(data.pricePerKg));
      if (data.form) setForm(data.form);
    }
  }, [data]);

  const handleSubmit = () => {
    if (!frpId || !manufacturingProcessId || !quantity) return;

    const body = {
      frpId,
      manufacturingProcessId,
      quantity: parseFloat(quantity),
      unit,
      condition,
      notes,
      collectorId: collectorId?.trim() || undefined,
      date: new Date().toISOString(),
      lifecycleStage: lifecycleStage || undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
      form: form || undefined,
    };

    if (isEdit) {
      update({ id: id!, body }, { onSuccess: () => router.back() });
    } else {
      create(body, { onSuccess: () => router.back() });
    }
  };

  if (isEdit && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={isEdit ? 'Edit Waste' : 'Log Waste'}
        subtitle={isEdit ? 'Update existing entry' : 'Add new waste entry'}
        showBack
      />

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <FormPicker
          label="FRP Type"
          required
          placeholder="Select FRP type"
          value={frpId}
          onChange={setFrpId}
          options={frpList.map((f: any) => ({
            label: `${f.composition?.composition_name || 'N/A'} | ${f.category?.category_name || 'N/A'} | ${f.grade?.grade_name || 'N/A'} | ${f.resin?.resin_name || 'N/A'}`,
            value: f.id,
          }))}
        />

        <View style={styles.qtyRow}>
          <View style={styles.qtyInput}>
            <FormInput
              label="Quantity"
              placeholder="0"
              keyboardType="decimal-pad"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>
          <div style={styles.unitPicker}>
            <FormPicker
              label="Unit"
              value={unit}
              onChange={setUnit}
              options={UNIT_OPTIONS}
            />
          </div>
        </View>

        <FormPicker
          label="Manufacturing Process"
          placeholder="Select process"
          value={manufacturingProcessId}
          onChange={setMfgId}
          options={mfgList.map((m: any) => ({
            label: m.manufacturing_process_name || 'Unnamed Process',
            value: m.id,
          }))}
        />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Waste Condition</Text>
          <View style={styles.segmented}>
            {CONDITIONS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.segment, condition === c && styles.segmentActive]}
                onPress={() => setCondition(c)}
              >
                <Text style={[styles.segmentText, condition === c && styles.segmentTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FormPicker
          label="Lifecycle Stage"
          value={lifecycleStage}
          onChange={setLifecycleStage}
          options={[
            { label: 'Pre-life', value: 'pre-life' },
            { label: 'In-life', value: 'in-life' },
            { label: 'End-of-life', value: 'end-of-life' }
          ]}
        />

        <FormInput
          label="Form / Shape"
          placeholder="e.g. Powder, Sheets, Offcuts"
          value={form}
          onChangeText={setForm}
        />

        <FormInput
          label="Asking Price (₹/kg)"
          keyboardType="decimal-pad"
          value={pricePerKg}
          onChangeText={setPricePerKg}
        />

        <View style={styles.field}>
          <TouchableOpacity style={styles.locationButton} onPress={captureLocation} activeOpacity={0.7}>
            <Text style={styles.locationButtonText}>📍 Use My Location</Text>
            {locationLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
          {captured && <Text style={styles.capturedText}>📍 Location captured</Text>}
        </View>

        <FormInput
          label="Additional Notes"
          placeholder="Any additional details..."
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          style={styles.textarea}
        />

        {error && <Text style={styles.errorText}>{error.message}</Text>}

        <SubmitButton
          label={isEdit ? 'Save Changes' : 'Log Waste'}
          loading={isPending}
          onPress={handleSubmit}
          style={styles.submit}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: spacing.screenPadding, gap: spacing[5], paddingBottom: 60 },
  qtyRow: { flexDirection: 'row', gap: spacing[3] },
  qtyInput: { flex: 2 },
  unitPicker: { flex: 1 },
  field: { gap: spacing[1] },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.input,
    borderRadius: radius.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: radius.md,
  },
  segmentActive: {
    backgroundColor: colors.card,
    shadowColor: '#1C2033',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: typography.fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: typography.fontWeight.medium,
  },
  segmentTextActive: {
    color: colors.foreground,
    fontWeight: typography.fontWeight.semiBold,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  submit: { marginTop: spacing[2] },
  errorText: { color: colors.destructive, fontSize: 13, marginTop: -10 },
  locationButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: spacing[3], 
    backgroundColor: colors.input, 
    borderRadius: radius.lg, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  locationButtonText: { color: colors.primary, fontWeight: '600' },
  capturedText: { fontSize: 12, color: colors.mutedForeground, marginTop: 4, textAlign: 'center' },
});