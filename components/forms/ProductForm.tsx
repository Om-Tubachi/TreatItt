import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useFrp } from '../../hooks/useFrp';
import { useCreateProduct, useProductById, useUpdateProduct } from '../../hooks/useProducts';
import FormInput from '../ui/FormInput';
import FormPicker from '../ui/FormPicker';
import SubmitButton from '../ui/SubmitButton';

export default function ProductForm({ id }: { id?: string }) {
  const isEdit = !!id;

  const { data: frpList = [] } = useFrp();
  const { data, isLoading } = useProductById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useCreateProduct();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateProduct();

  const [frpId, setFrpId] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (data) {
      setFrpId(data.frpId ?? '');
      setDescription(data.description ?? '');
    }
  }, [data]);

  const error = createError || updateError;
  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!frpId) return;
    const body = { frpId, description: description || undefined };
    if (isEdit) {
      update({ id: id!, body }, { onSuccess: () => router.back() });
    } else {
      create(body, { onSuccess: () => router.back() });
    }
  };

  if (isEdit && isLoading) return <ActivityIndicator style={styles.centered} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Product' : 'Log Product'}</Text>

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
      <FormInput label="Description" value={description} onChangeText={setDescription} placeholder="Optional" multiline numberOfLines={4} />

      {error && <Text style={styles.error}>{error.message}</Text>}
      <SubmitButton label={isEdit ? 'Save Changes' : 'Log Product'} onPress={handleSubmit} isPending={isPending} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', fontSize: 13 },
});