import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useFrp } from '../../hooks/useFrp';
import { useManufacturingProcesses } from '../../hooks/useManufacturingProcesses';
import { useUpdateWaste, useUploadWaste, useWasteById } from '../../hooks/useWastes';
import FormInput from '../ui/FormInput';
import FormPicker from '../ui/FormPicker';
import SubmitButton from '../ui/SubmitButton';

export default function WasteForm({ id }: { id?: string }) {
  const isEdit = !!id;

  const { data: frpList = [] } = useFrp();
  const { data: mfgList = [] } = useManufacturingProcesses();
  const { data, isLoading } = useWasteById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useUploadWaste();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateWaste();

  const [frpId, setFrpId] = useState('');
  const [manufacturingProcessId, setMfgId] = useState('');
  const [collectorId, setCollectorId] = useState('');
  const [quantity, setQuantity] = useState('');

  // Sync state when editing
  useEffect(() => {
    if (data) {
      setFrpId(data.frpId ?? '');
      setMfgId(data.manufacturingProcessId ?? '');
      setCollectorId(data.collectorId ?? '');
      setQuantity(String(data.quantity ?? ''));
    }
  }, [data]);

  const error = createError || updateError;
  const isPending = creating || updating;

  const handleSubmit = () => {
    // Basic validation
    if (!frpId || !manufacturingProcessId || !quantity) return;

    const body = {
      frpId,
      manufacturingProcessId,
      collectorId: collectorId?.trim() || undefined,
      quantity: parseFloat(quantity),
      date: new Date().toISOString(), // Ensure date is always sent
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
      <Text style={styles.title}>{isEdit ? 'Edit Waste' : 'Log Waste'}</Text>

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

      <FormPicker
        label="Manufacturing Process"
        required
        selectedValue={manufacturingProcessId}
        onValueChange={setMfgId}
        options={mfgList.map((m: any) => ({
          label: m.manufacturing_process_name || 'Unnamed Process',
          value: m.id
        }))}
      />

      <FormInput
        label="Quantity (kg)"
        required
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="decimal-pad"
        placeholder="0"
      />

      <FormInput
        label="Collector ID (optional)"
        value={collectorId}
        onChangeText={setCollectorId}
        placeholder="Leave blank if none"
      />

      {error && <Text style={styles.error}>{error.message}</Text>}

      <SubmitButton
        label={isEdit ? 'Save Changes' : 'Log Waste'}
        onPress={handleSubmit}
        isPending={isPending}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', fontSize: 13 },
});