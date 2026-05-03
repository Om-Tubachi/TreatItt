import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useRequirementById } from '../../../hooks/useRequirements';
export default function RequirementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useRequirementById(id);
  if (isLoading) return <ActivityIndicator style={styles.centered} />;
  if (error) return <Text style={styles.error}>{error.message}</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Requirement Detail</Text>
      <Text>FRP: {data?.frpId}</Text>
      <Text>Est / Month: {data?.estReqPerMonth}</Text>
      <Text>Act / Month: {data?.actReqPerMonth ?? 'N/A'}</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  centered: { flex: 1, marginTop: 40 },
  container: { padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: '600' },
  error: { color: 'red', padding: 16 },
});