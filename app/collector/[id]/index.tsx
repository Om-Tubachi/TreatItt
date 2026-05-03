import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useCollectorById } from '../../../hooks/useCollectors';
export default function CollectorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useCollectorById(id);
  if (isLoading) return <ActivityIndicator style={styles.centered} />;
  if (error) return <Text style={styles.error}>{error.message}</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Collection Point Detail</Text>
      <Text>Address: {data?.address}</Text>
      <Text>Lat: {data?.latitude}</Text>
      <Text>Lng: {data?.longitude}</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', padding: 16 },
});