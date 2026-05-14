import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';
import { useFrp } from '../../hooks/useFrp';
import { useCreateProduct, useProductById, useUpdateProduct } from '../../hooks/useProducts';
import { useLocation } from '../../utils/useLocation';
import { FormInput } from '../ui/FormInput';
import { FormPicker } from '../ui/FormPicker';
import { SubmitButton } from '../ui/SubmitButton';

export default function ProductForm({ id }: { id?: string }) {
  const isEdit = !!id;

  const { data: frpList = [] } = useFrp();
  const { data, isLoading } = useProductById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useCreateProduct();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateProduct();
  const { latitude, longitude, captured, loading: locationLoading, captureLocation } = useLocation();

  const [frpId, setFrpId] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [form, setForm] = useState('');

  useEffect(() => {
    if (data) {
      setFrpId(data.frpId ?? '');
      setDescription(data.description ?? '');
      if (data.quantity) setQuantity(String(data.quantity));
      if (data.price) setPrice(String(data.price));
      if (data.form) setForm(data.form);
    }
  }, [data]);

  const error = createError || updateError;
  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!frpId) return;
    const body = {
      frpId,
      description: description || undefined,
      quantity: quantity ? parseFloat(quantity) : undefined,
      price: price ? parseFloat(price) : undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      form: form || undefined,
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
      <Text style={styles.title}>{isEdit ? 'Edit Product' : 'Log Product'}</Text>

      <FormPicker
        label="FRP Type"
        required
        value={frpId}
        onChange={setFrpId}
        options={frpList.map((f: any) => ({
          label: `${f.composition?.composition_name || 'N/A'} | ${f.category?.category_name || 'N/A'} | ${f.grade?.grade_name || 'N/A'} | ${f.resin?.resin_name || 'N/A'}`,
          value: f.id
        }))}
      />
      <FormInput label="Description" value={description} onChangeText={setDescription} placeholder="Optional" multiline numberOfLines={4} />

      <FormInput
        label="Form / Shape"
        placeholder="e.g. Pellets, Woven, Sheet"
        value={form}
        onChangeText={setForm}
      />
      <FormInput
        label="Quantity (kg)"
        keyboardType="decimal-pad"
        value={quantity}
        onChangeText={setQuantity}
      />
      <FormInput
        label="Price (₹/kg)"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
      />

      <View>
        <TouchableOpacity style={styles.locationButton} onPress={captureLocation} activeOpacity={0.7}>
          <Text style={styles.locationButtonText}>📍 Use My Location</Text>
          {locationLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
        {captured && <Text style={styles.capturedText}>📍 Location captured</Text>}
      </View>

      {error && <Text style={styles.error}>{error.message}</Text>}
      <SubmitButton label={isEdit ? 'Save Changes' : 'Log Product'} onPress={handleSubmit} loading={isPending} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', fontSize: 13 },
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