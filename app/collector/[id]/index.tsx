import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCollectorById } from '../../../hooks/useCollectors';

export default function CollectorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useCollectorById(id);

  if (isLoading) return <ActivityIndicator style={styles.centered} />;
  if (error) return <Text style={styles.error}>{error.message}</Text>;
  if (!data) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{data.users?.username ?? 'Collection Point'}</Text>

      {/* Map / coords placeholder — swap View for MapView once installed */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>
          {data.latitude && data.longitude
            ? `lat: ${data.latitude}  lng: ${data.longitude}`
            : 'map / coords'}
        </Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.sectionLabel}>Details</Text>
        <Field label="Address" value={data.address} />
        <Field label="Latitude" value={data.latitude?.toString()} />
        <Field label="Longitude" value={data.longitude?.toString()} />
      </View>
    </ScrollView>
  );
}

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || '—'}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  mapPlaceholder: { height: 200, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  mapText: { color: '#999', fontSize: 14 },
  detailBox: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, gap: 8 },
  sectionLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  field: { gap: 2 },
  fieldLabel: { fontSize: 12, color: '#888' },
  fieldValue: { fontSize: 15 },
  error: { color: 'red', padding: 16 },
});