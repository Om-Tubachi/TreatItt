import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  isPending: boolean;
}

export default function SubmitButton({ label, onPress, isPending }: Props) {
  return (
    <TouchableOpacity style={[styles.btn, isPending && styles.disabled]} onPress={onPress} disabled={isPending}>
      {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontSize: 15, fontWeight: '600' },
});