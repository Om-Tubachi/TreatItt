import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../constants/theme';

interface Props {
    firstName?: string;
    lastName?: string;
    size?: number;
}

export const Avatar: React.FC<Props> = ({ firstName = '', lastName = '', size = 36 }) => {
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
    return (
        <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={styles.initials}>{initials || '?'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    circle: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    initials: { fontFamily: typography.bodyMed, fontSize: 13, color: colors.brandDeep, fontWeight: '700' },
});