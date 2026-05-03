import { useLocalSearchParams } from 'expo-router';
import RequirementForm from '../../../components/forms/RequirementForm';
export default function EditRequirement() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RequirementForm id={id} />;
}