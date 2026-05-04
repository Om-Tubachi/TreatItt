import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useFrp } from '../../hooks/useFrp';
import { useCreateRequirement, useRequirementById, useUpdateRequirement } from '../../hooks/useRequirements';
import FormInput from '../ui/FormInput';
import FormPicker from '../ui/FormPicker';
import SubmitButton from '../ui/SubmitButton';

export default function RequirementForm({ id }: { id?: string }) {
  const isEdit = !!id;

  const { data: frpList = [] } = useFrp();
  const { data, isLoading } = useRequirementById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useCreateRequirement();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateRequirement();

  const [frpId, setFrpId] = useState('');
  const [estReqPerMonth, setEst] = useState('');
  const [actReqPerMonth, setAct] = useState('');

  useEffect(() => {
    if (data) {
      setFrpId(data.frpId ?? '');
      setEst(String(data.estReqPerMonth ?? ''));
      setAct(String(data.actReqPerMonth ?? ''));
    }
  }, [data]);

  const error = createError || updateError;
  const isPending = creating || updating;

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

  if (isEdit && isLoading) return <ActivityIndicator style={styles.centered} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Requirement' : 'Log Requirement'}</Text>

      {/* <FormPicker
        label="FRP Type"
        required
        selectedValue={frpId}
        onValueChange={setFrpId}
        options={frpList.map((f: any) => ({ label: f.name, value: f.id }))}
      /> */}
      <FormPicker
        label="FRP Type"
        required
        selectedValue={frpId}
        onValueChange={setFrpId}
        options={frpList.map((f: any) => ({
          label: `${f.composition?.composition_name || 'N/A'} | ${f.category?.category_name || 'N/A'} | ${f.grade?.grade_name || 'N/A'} | ${f.resin?.resin_name || 'N/A'}`,
          value: f.id
        }))}
      />
      <FormInput label="Estimated Req / Month (kg)" required value={estReqPerMonth} onChangeText={setEst} keyboardType="decimal-pad" placeholder="0" />
      <FormInput label="Actual Req / Month (kg)" value={actReqPerMonth} onChangeText={setAct} keyboardType="decimal-pad" placeholder="Optional" />

      {error && <Text style={styles.error}>{error.message}</Text>}
      <SubmitButton label={isEdit ? 'Save Changes' : 'Log Requirement'} onPress={handleSubmit} isPending={isPending} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', fontSize: 13 },
});