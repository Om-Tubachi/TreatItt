import { useLocalSearchParams } from 'expo-router';
import RecyclerForm from '../../../components/forms/RecyclerForm';
export default function EditRecycler() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RecyclerForm id={id} />;
}