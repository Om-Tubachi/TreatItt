import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { card, colors, fontSize, radius, typography } from '../../constants/theme';

interface Option { id: string; label: string; }

interface Props {
    label: string;
    options: Option[];
    selected?: Option;
    onSelect: (o: Option) => void;
    placeholder?: string;
}

export const SelectField: React.FC<Props> = ({ label, options, selected, onSelect, placeholder = 'Select...' }) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
                <Text style={[styles.triggerText, !selected && styles.placeholder]}>
                    {selected?.label ?? placeholder}
                </Text>
                <Text style={styles.arrow}>▾</Text>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="slide">
                <TouchableOpacity style={styles.backdrop} onPress={() => setOpen(false)} />
                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <Text style={styles.sheetTitle}>{label}</Text>
                    <FlatList
                        data={options}
                        keyExtractor={i => i.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.option, selected?.id === item.id && styles.optionActive]}
                                onPress={() => { onSelect(item); setOpen(false); }}
                            >
                                <Text style={[styles.optionText, selected?.id === item.id && styles.optionTextActive]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 6 },
    label: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8 },
    trigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: card.borderWidth, borderColor: colors.inputBorder, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: colors.white },
    triggerText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
    placeholder: { color: colors.placeholder },
    arrow: { color: colors.body, fontSize: 12 },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '60%' },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.inputBorder, alignSelf: 'center', marginBottom: 16 },
    sheetTitle: { fontFamily: typography.heading, fontSize: fontSize.md, color: colors.black, marginBottom: 12 },
    option: { paddingVertical: 14, paddingHorizontal: 8, borderRadius: radius.sm },
    optionActive: { backgroundColor: colors.gradientStart },
    optionText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
    optionTextActive: { color: colors.primaryDark, fontFamily: typography.bodyMed },
});