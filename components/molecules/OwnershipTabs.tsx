import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { card, colors, fontSize, radius, spacing, typography } from '../../constants/theme';

interface Props {
    tab: 'all' | 'mine';
    onChange: (t: 'all' | 'mine') => void;
    allLabel: string;
    mineLabel: string;
}

export const OwnershipTabs: React.FC<Props> = ({ tab, onChange, allLabel, mineLabel }) => (
    <View style={styles.row}>
        <TouchableOpacity style={[styles.tab, tab === 'all' && styles.tabActive]} onPress={() => onChange('all')}>
            <Text style={[styles.text, tab === 'all' && styles.textActive]}>{allLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'mine' && styles.tabActive]} onPress={() => onChange('mine')}>
            <Text style={[styles.text, tab === 'mine' && styles.textActive]}>{mineLabel}</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: 20, marginBottom: spacing.md },
    tab: { flex: 1, paddingVertical: 10, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', backgroundColor: card.bg },
    tabActive: { backgroundColor: colors.primary },
    text: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.primaryDark },
    textActive: { color: colors.white },
});