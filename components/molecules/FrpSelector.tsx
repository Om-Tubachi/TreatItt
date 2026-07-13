import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, typography } from '../../constants/theme';
import { useFrp } from '../../hooks/useFrp';
import { SelectField } from './SelectField';

interface Props {
    onFrpResolved: (frpId: string | null) => void;
    initialValues?: {
        composition?: { id: string; label: string };
        category?: { id: string; label: string };
        grade?: { id: string; label: string };
        resin?: { id: string; label: string };
    };
}

type SelectionItem = { id: string; label: string };

export const FrpSelector: React.FC<Props> = ({ onFrpResolved, initialValues }) => {
    const { data: lookups } = useFrp();

    const [composition, setComposition] = useState<SelectionItem | undefined>(initialValues?.composition);
    const [grade, setGrade] = useState<SelectionItem | undefined>(initialValues?.grade);
    const [category, setCategory] = useState<SelectionItem | undefined>(initialValues?.category);
    const [resin, setResin] = useState<SelectionItem | undefined>(initialValues?.resin);
    const [error, setError] = useState('');

    // Synchronize local dropdown state when async edit data hydrates from the parent
    useEffect(() => {
        if (initialValues) {
            if (initialValues.composition) setComposition(initialValues.composition);
            if (initialValues.category) setCategory(initialValues.category);
            if (initialValues.grade) setGrade(initialValues.grade);
            if (initialValues.resin) setResin(initialValues.resin);
        }
    }, [initialValues]);

    // Extract list selections directly from structural atom lookups
    const compositionOptions = lookups ? Object.values(lookups.compositions) : [];
    const gradeOptions = lookups ? Object.values(lookups.grades) : [];
    const categoryOptions = lookups ? Object.values(lookups.categories) : [];
    const resinOptions = lookups ? Object.values(lookups.resins) : [];

    // Track state variations and resolve valid structural IDs downstream
    useEffect(() => {
        if (!composition && !grade && !category && !resin) {
            onFrpResolved(null);
            setError('');
            return;
        }

        // Check validation combinations if you match against strict multi-relational pairs
        if (lookups?.rawEntries) {
            const exactMatch = lookups.rawEntries.find((entry: any) =>
                (!composition || entry.composition?.id === composition.id) &&
                (!category || entry.category?.id === category.id) &&
                (!grade || entry.grade?.id === grade.id) &&
                (!resin || entry.resin?.id === resin.id)
            );

            if (exactMatch) {
                setError('');
                onFrpResolved(exactMatch.id);
            } else {
                setError('Invalid combination');
                onFrpResolved(null);
            }
        } else {
            // lookups not ready yet — don't guess, don't resolve
            onFrpResolved(null);
        }
    }, [composition, grade, category, resin, lookups]);

    return (
        <View style={styles.container}>
            <SelectField label="Composition" options={compositionOptions} selected={composition} onSelect={setComposition} />
            <SelectField label="Grade" options={gradeOptions} selected={grade} onSelect={setGrade} />
            <SelectField label="Category" options={categoryOptions} selected={category} onSelect={setCategory} />
            <SelectField label="Resin" options={resinOptions} selected={resin} onSelect={setResin} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 12 },
    error: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.error, marginTop: 4 },
});