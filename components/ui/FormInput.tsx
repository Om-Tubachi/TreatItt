import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  required?: boolean;
}

export default function FormInput({ label, required, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}{required && ' *'}</Text>
      <TextInput 
        style={styles.input} 
        placeholderTextColor="#999" 
        {...props} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { fontSize: 13, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 48,
    backgroundColor: '#fff', // Added background for visibility
    color: '#000', // Added text color
  },
});