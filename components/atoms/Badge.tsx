import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { fontSize, radius, typography } from '../../constants/theme';

type Variant = 'urgent' | 'available' | 'accepting' | 'amber' | 'outlined';

const V: Record<Variant, { bg: string; text: string; border: string }> = {
    urgent: { bg: '#FFE5E5', text: '#C0392B', border: '#C0392B' },
    available: { bg: '#E8F9D0', text: '#4C862D', border: '#4C862D' },
    accepting: { bg: '#E8F0FF', text: '#2563EB', border: '#2563EB' },
    amber: { bg: '#FFF3E0', text: '#D97706', border: '#D97706' },
    outlined: { bg: 'transparent', text: '#4C862D', border: '#4C862D' },
};

interface Props { label: string; variant?: Variant; style?: ViewStyle; }

export const Badge: React.FC<Props> = ({ label, variant = 'outlined', style }) => {
    const v = V[variant];
    return (
        <View style={[styles.base, { backgroundColor: v.bg, borderColor: v.border }, style]}>
            <Text style={[styles.text, { color: v.text }]}>{label.toUpperCase()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    base: { borderWidth: 1, borderRadius: radius.xl, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
    text: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, letterSpacing: 0.8 },
});