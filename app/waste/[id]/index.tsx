import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useWasteById } from '../../../hooks/useWastes';
export default function WasteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useWasteById(id);
  if (isLoading) return <ActivityIndicator style={styles.centered} />;
  if (error) return <Text style={styles.error}>{error.message}</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Waste Detail</Text>
      <Text>FRP: {data?.frp?.composition?.composition_name ?? 'N/A'}</Text>
      <Text>Process: {data?.manufacturing_processes?.manufacturing_process_name ?? 'N/A'}</Text>
      <Text>Collector: {data?.collectors?.name ?? 'None'}</Text>
      <Text>Quantity: {data?.quantity}</Text>
      
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', padding: 16 },
});