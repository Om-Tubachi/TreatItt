import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';

interface Option { label: string; value: string; }

interface Props {
  label: string;
  required?: boolean;
  selectedValue: string;
  onValueChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function FormPicker({ label, required, selectedValue, onValueChange, options, placeholder = 'Select...' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}{required && ' *'}</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map(o => (
            <Picker.Item key={o.value} label={o.label} value={o.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { fontSize: 13, color: '#333' },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff', // Added background for visibility
  },
  picker: {
    color: '#000', // Added text color
  }
});