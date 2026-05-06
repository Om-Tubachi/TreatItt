import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { FormInput } from '../ui/FormInput';
import { FormPicker } from '../ui/FormPicker';
import { ScreenHeader } from '../ui/ScreenHeader';
import { SubmitButton } from '../ui/SubmitButton';

import { useFrp } from '../../hooks/useFrp';
import { useCreateRequirement, useRequirementById, useUpdateRequirement } from '../../hooks/useRequirements';

interface RequirementFormProps {
  id?: string;
}

export default function RequirementForm({ id }: RequirementFormProps) {
  const isEdit = !!id;

  const { data: frpList = [] } = useFrp();
  const { data, isLoading } = useRequirementById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useCreateRequirement();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateRequirement();

  const [frpId, setFrpId] = useState('');
  const [estReqPerMonth, setEstReqPerMonth] = useState('');
  const [actReqPerMonth, setActReqPerMonth] = useState('');

  const error = createError || updateError;
  const isPending = creating || updating;

  useEffect(() => {
    if (data) {
      setFrpId(data.frpId ?? '');
      setEstReqPerMonth(String(data.estReqPerMonth ?? ''));
      setActReqPerMonth(String(data.actReqPerMonth ?? ''));
    }
  }, [data]);

  const handleSubmit = () => {
    if (!frpId || !estReqPerMonth) return;
    
    const body = {
      frpId,
      estReqPerMonth: estReqPerMonth.toString(),
      actReqPerMonth: actReqPerMonth ? actReqPerMonth.toString() : undefined,
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
});