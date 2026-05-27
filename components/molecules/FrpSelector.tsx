import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, typography } from '../../constants/theme';
import { useFrp } from '../../hooks/useFrp';
import { SectionHeader } from './SectionHeader';
import { SelectField } from './SelectField';

interface Props {
    onFrpResolved: (frpId: string | null) => void;
}

export const FrpSelector: React.FC<Props> = ({ onFrpResolved }) => {
    const { data: frpList = [] } = useFrp();

    const [composition, setComposition] = useState<{ id: string; label: string } | undefined>();
    const [grade, setGrade] = useState<{ id: string; label: string } | undefined>();
    const [category, setCategory] = useState<{ id: string; label: string } | undefined>();
    const [resin, setResin] = useState<{ id: string; label: string } | undefined>();
    const [error, setError] = useState('');

    const unique = (key: string, labelKey: string) =>
        [...new Map(frpList.map((f: any) => [f[key]?.id, { id: f[key]?.id, label: f[key]?.[labelKey] }])).values()]
            .filter((o: any) => o.id);

    useEffect(() => {
        if (!composition && !grade && !category && !resin) { onFrpResolved(null); return; }

        const match = frpList.find((f: any) =>
            (!composition || f.composition?.id === composition.id) &&
            (!grade || f.grade?.id === grade.id) &&
            (!category || f.category?.id === category.id) &&
            (!resin || f.resin?.id === resin.id)
        );

        if (match) { setError(''); onFrpResolved(match.id); }
        else { setError('Invalid combination'); onFrpResolved(null); }
    }, [composition, grade, category, resin]);

    return (
        <View style={styles.container}>
            <SectionHeader title="FRP Material" />
            <SelectField label="Composition" options={unique('composition', 'composition_name')} selected={composition} onSelect={setComposition} />
            <SelectField label="Grade" options={unique('grade', 'grade_name')} selected={grade} onSelect={setGrade} />
            <SelectField label="Category" options={unique('category', 'category_name')} selected={category} onSelect={setCategory} />
            <SelectField label="Resin" options={unique('resin', 'resin_name')} selected={resin} onSelect={setResin} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 12 },
    error: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.error },
});