import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { card, colors, fontSize, radius, spacing, typography } from '../../constants/theme';
import { useUserSearch } from '../../hooks/useUsers';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { Input } from '../atoms/Input';

export function UserSearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [debounced, setDebounced] = useState('');

    // §3.5 — 300ms debounce before hitting useUserSearch
    useEffect(() => {
        const t = setTimeout(() => setDebounced(query), 300);
        return () => clearTimeout(t);
    }, [query]);

    const { data: results = [], isFetching } = useUserSearch(debounced);
    const showDropdown = debounced.trim().length >= 2;

    return (
        <View style={styles.container}>
            <Input
                placeholder="Search by username..."
                value={query}
                onChangeText={setQuery}
                style={styles.input}
            />

            {showDropdown && (
                <View style={styles.dropdown}>
                    {isFetching && !results.length ? (
                        <Text style={styles.hint}>Searching…</Text>
                    ) : results.length === 0 ? (
                        <Text style={styles.hint}>No users found.</Text>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item }: { item: any }) => (
                                <TouchableOpacity
                                    style={styles.row}
                                    onPress={() => router.push({ pathname: '/screens/profile/[id]', params: { id: item.id } })}
                                >
                                    <Avatar firstName={item.first_name} lastName={item.last_name} />
                                    <View style={styles.info}>
                                        <Text style={styles.name}>
                                            {[item.first_name, item.last_name].filter(Boolean).join(' ') || item.username}
                                        </Text>
                                        {item.company_name ? <Text style={styles.company}>{item.company_name}</Text> : null}
                                        {item.badges?.length ? (
                                            <View style={styles.badgeRow}>
                                                {item.badges.map((b: string) => <Badge key={b} label={b} variant="outlined" />)}
                                            </View>
                                        ) : null}
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative', zIndex: 10 },
    input: { width: '100%' },
    dropdown: { backgroundColor: card.bg, borderRadius: radius.md, borderWidth: card.borderWidth, borderColor: card.border, marginTop: 6, maxHeight: 320, overflow: 'hidden' },
    hint: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, padding: spacing.lg, textAlign: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: spacing.md, borderBottomWidth: 0.5, borderBottomColor: card.border },
    info: { flex: 1, gap: 2 },
    name: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
    company: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
});
