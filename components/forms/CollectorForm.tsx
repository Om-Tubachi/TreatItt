import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useCollectorById, useRegisterCollector, useUpdateCollector } from '../../hooks/useCollectors';
import FormInput from '../ui/FormInput';
import SubmitButton from '../ui/SubmitButton';

export default function CollectorForm({ id }: { id?: string }) {
  const isEdit = !!id;

  const { data, isLoading } = useCollectorById(id!, { enabled: isEdit });
  const { mutate: create, isPending: creating, error: createError } = useRegisterCollector();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateCollector();

  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    if (data) {
      setAddress(data.address ?? '');
      setLatitude(String(data.latitude ?? ''));
      setLongitude(String(data.longitude ?? ''));
    }
  }, [data]);

  const fetchLocation = async () => {
    setLocating(true);
    setLocError('');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setLocError('Location permission denied'); setLocating(false); return; }
    const loc = await Location.getCurrentPositionAsync({});
    setLatitude(String(loc.coords.latitude));
    setLongitude(String(loc.coords.longitude));
    setLocating(false);
  };

  const error = createError || updateError;
  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!address.trim() || !latitude || !longitude) return;
    const body = { address, latitude: latitude.toString(), longitude: longitude.toString() };
    if (isEdit) {
      update({ id: id!, body }, { onSuccess: () => router.back() });
    } else {
      create(body, { onSuccess: () => router.back() });
    }
  };

  if (isEdit && isLoading) return <ActivityIndicator style={styles.centered} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Collection Point' : 'Register as Collection Point'}</Text>

      <FormInput label="Address" required value={address} onChangeText={setAddress} placeholder="Enter address" multiline />
      <FormInput label="Latitude" required value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" placeholder="0.000000" />
      <FormInput label="Longitude" required value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" placeholder="0.000000" />

      <TouchableOpacity style={styles.locBtn} onPress={fetchLocation} disabled={locating}>
        {locating ? <ActivityIndicator /> : <Text>Use current location</Text>}
      </TouchableOpacity>

      {locError ? <Text style={styles.error}>{locError}</Text> : null}
      {error    ? <Text style={styles.error}>{error.message}</Text> : null}
      <SubmitButton label={isEdit ? 'Save Changes' : 'Register'} onPress={handleSubmit} isPending={isPending} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  locBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, alignItems: 'center' },
  error: { color: 'red', fontSize: 13 },
});