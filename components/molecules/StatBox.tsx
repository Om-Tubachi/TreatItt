import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { card, colors, fontSize, radius, typography } from '../../constants/theme';

interface Props { label: string; value: string; style?: ViewStyle; }

export const StatBox: React.FC<Props> = ({ label, value, style }) => (
    <View style={[styles.box, style]}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    box: { backgroundColor: card.statBg, borderRadius: radius.sm, padding: 10, flex: 1 },
    label: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
    value: { fontFamily: typography.heading, fontSize: fontSize.lg, color: colors.black },
});