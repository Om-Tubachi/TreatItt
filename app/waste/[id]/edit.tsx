import { useLocalSearchParams } from 'expo-router';
import WasteForm from '../../../components/forms/WasteForm';
export default function EditWaste() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <WasteForm id={id} />;
}