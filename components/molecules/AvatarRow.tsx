import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, typography } from '../../constants/theme';
import { Avatar } from '../atoms/Avatar';

interface Props {
    firstName?: string;
    lastName?: string;
    role?: string;
    company?: string;
    location?: string;
}

export const AvatarRow: React.FC<Props> = ({ firstName, lastName, role, company, location }) => (
    <View style={styles.row}>
        <Avatar firstName={firstName} lastName={lastName} />
        <View style={styles.info}>
            <Text style={styles.name}>{`${firstName ?? ''} ${lastName ?? ''}`.trim() || '—'}</Text>
            {(role || company) && <Text style={styles.sub}>{[role, company].filter(Boolean).join(' · ')}</Text>}
        </View>
        {location && <Text style={styles.location}>📍 {location}</Text>}
    </View>
);

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    info: { flex: 1 },
    name: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    sub: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    location: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
});