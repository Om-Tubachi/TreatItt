import { useLocalSearchParams } from 'expo-router';
import CollectorForm from '../../../components/forms/CollectorForm';
export default function EditCollector() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CollectorForm id={id} />;
}