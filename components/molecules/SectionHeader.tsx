import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, typography } from '../../constants/theme';

interface Props { title: string; }

export const SectionHeader: React.FC<Props> = ({ title }) => (
    <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.line} />
    </View>
);

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
    text: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 1 },
    line: { flex: 1, height: 1, backgroundColor: colors.inputBorder },
});