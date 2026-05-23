import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSize, radius, typography } from '../../constants/theme';

interface Props {
    label: string;
    style?: ViewStyle;
}

export const Pill: React.FC<Props> = ({ label, style }) => (
    <View style={[styles.base, style]}>
        <Text style={styles.text}>{label.toUpperCase()}</Text>
    </View>
);

const styles = StyleSheet.create({
    base: {
        borderWidth: 1,
        borderColor: colors.primaryDark,
        borderRadius: radius.xl,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    text: {
        fontFamily: typography.body,
        fontSize: fontSize.xs,
        color: colors.primaryDark,
        letterSpacing: 0.5,
    },
});