import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FrpShape } from '../../types/entities';
import { Pill } from '../atoms/Pill';

interface Props { frp?: FrpShape; row?: boolean; }

export const FrpPills: React.FC<Props> = ({ frp, row = false }) => {
    const pills = [
        frp?.composition?.composition_name,
        frp?.grade?.grade_name,
        frp?.category?.category_name,
        frp?.resin?.resin_name,
    ].filter(Boolean) as string[];

    if (!pills.length) return null;

    return (
        <View style={row ? styles.row : styles.grid}>
            {pills.map(p => <Pill key={p} label={p} />)}
        </View>
    );
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});