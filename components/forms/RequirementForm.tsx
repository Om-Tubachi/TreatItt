import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';
import { FormInput } from '../ui/FormInput';
import { FormPicker } from '../ui/FormPicker';
import { ScreenHeader } from '../ui/ScreenHeader';
import { SubmitButton } from '../ui/SubmitButton';

import { useFrp } from '../../hooks/useFrp';
import { useCreateRequirement, useRequirementById, useUpdateRequirement } from '../../hooks/useRequirements';
import { useLocation } from '../../utils/useLocation';

interface RequirementFormProps {
  id?: string;
}

export default function RequirementForm({ id }: RequirementFormProps) {
  const isEdit = !!id;

  const { data: frpList = [] } = useFrp();
  const { data, isLoading } = useRequirementById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useCreateRequirement();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateRequirement();
  const { latitude, longitude, captured, loading: locationLoading, captureLocation } = useLocation();

  const [frpId, setFrpId] = useState('');
  const [estReqPerMonth, setEstReqPerMonth] = useState('');
  const [actReqPerMonth, setActReqPerMonth] = useState('');
  const [urgency, setUrgency] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');

  const error = createError || updateError;
  const isPending = creating || updating;

  useEffect(() => {
    if (data) {
      setFrpId(data.frpId ?? '');
      setEstReqPerMonth(String(data.estReqPerMonth ?? ''));
      setActReqPerMonth(String(data.actReqPerMonth ?? ''));
      if (data.urgency) setUrgency(data.urgency);
      if (data.pricePerKg) setPricePerKg(String(data.pricePerKg));
    }
  }, [data]);

  const handleSubmit = () => {
    if (!frpId || !estReqPerMonth) return;
    
    const body = {
      frpId,
      estReqPerMonth: estReqPerMonth.toString(),
      actReqPerMonth: actReqPerMonth ? actReqPerMonth.toString() : undefined,
      urgency: urgency || undefined,
      pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    };

    if (isEdit) {
      update({ id: id!, body }, { onSuccess: () => router.back() });
    } else {
      create(body, { onSuccess: () => router.back() });
    }
  };

  if (isEdit && isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader 
        title={isEdit ? 'Edit Requirement' : 'Log Requirement'} 
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

        <FormInput
          label="Estimated Req / Month (kg)"
          required
          placeholder="0"
          keyboardType="decimal-pad"
          value={estReqPerMonth}
          onChangeText={setEstReqPerMonth}
        />

        <FormInput
          label="Actual Req / Month (kg)"
          optional
          placeholder="Optional"
          keyboardType="decimal-pad"
          value={actReqPerMonth}
          onChangeText={setActReqPerMonth}
        />

        <FormPicker
          label="Urgency"
          value={urgency}
          onChange={setUrgency}
          options={[
            { label: 'Immediate', value: 'immediate' },
            { label: 'Within Month', value: 'within month' },
            { label: 'Flexible', value: 'flexible' }
          ]}
        />

        <FormInput
          label="Budget (₹/kg)"
          keyboardType="decimal-pad"
          value={pricePerKg}
          onChangeText={setPricePerKg}
        />

        <View>
          <TouchableOpacity style={styles.locationButton} onPress={captureLocation} activeOpacity={0.7}>
            <Text style={styles.locationButtonText}>📍 Use My Location</Text>
            {locationLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
          {captured && <Text style={styles.capturedText}>📍 Location captured</Text>}
        </View>

        {error && <Text style={styles.error}>{error.message}</Text>}

        <SubmitButton
          label={isEdit ? 'Save Changes' : 'Log Requirement'}
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: spacing.screenPadding, gap: spacing[5], paddingBottom: 60 },
  submit: { marginTop: spacing[4] },
  error: { color: colors.destructive || 'red', fontSize: 13, marginTop: -spacing[2] },
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