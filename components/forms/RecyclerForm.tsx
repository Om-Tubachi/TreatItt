import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useRecyclerById, useRegisterRecycler, useUpdateRecycler } from '../../hooks/useRecyclers';
import FormInput from '../ui/FormInput';
import SubmitButton from '../ui/SubmitButton';

export default function RecyclerForm({ id }: { id?: string }) {
  const isEdit = !!id;

  const { data, isLoading } = useRecyclerById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useRegisterRecycler();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateRecycler();

  const [address, setAddress] = useState('');

  useEffect(() => {
    if (data) setAddress(data.address ?? '');
  }, [data]);

  const error = createError || updateError;
  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!address.trim()) return;
    if (isEdit) {
      update({ id: id!, body: { address } }, { onSuccess: () => router.back() });
    } else {
      create({ address }, { onSuccess: () => router.back() });
    }
  };

  if (isEdit && isLoading) return <ActivityIndicator style={styles.centered} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Recycler' : 'Register as Recycler'}</Text>

      <FormInput label="Address" required value={address} onChangeText={setAddress} placeholder="Enter address" multiline />

      {error && <Text style={styles.error}>{error.message}</Text>}
      <SubmitButton label={isEdit ? 'Save Changes' : 'Register'} onPress={handleSubmit} isPending={isPending} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', fontSize: 13 },
});