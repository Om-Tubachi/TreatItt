import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/auth';
import { useProductsByUser } from '../../hooks/useProducts';
import { useRequirementsByUser } from '../../hooks/useRequirements';
import { useTreatmentsByRecycler } from '../../hooks/useTreatments';
import { useWasteEntriesOfUser } from '../../hooks/useWastes';

type Category = 'products' | 'waste' | 'services' | 'requirements';
const CATEGORIES: Category[] = ['products', 'waste', 'services', 'requirements'];

function useUserData(category: Category, userId: string) {
    const products = useProductsByUser(userId, { enabled: category === 'products' });
    const waste = useWasteEntriesOfUser(userId, { enabled: category === 'waste' });
    const services = useTreatmentsByRecycler(userId, { enabled: category === 'services' });
    const requirements = useRequirementsByUser(userId, { enabled: category === 'requirements' });

    const map: Record<Category, { data: any; isLoading: boolean; error: any }> = {
        products, waste, services, requirements,
    };
    return map[category];
}

function getLabel(category: Category, item: any): string {
    switch (category) {
        case 'products':
            return `${item.frp?.composition?.composition_name ?? 'N/A'} | ${item.frp?.category?.category_name ?? 'N/A'} | ${item.description ?? ''}`;
        case 'waste':
            return `${item.frp?.category?.category_name ?? 'N/A'} | qty: ${item.quantity ?? '—'} | ${item.status ?? '—'}`;
        case 'services':
            return `${item.treatment_processes?.process ?? 'N/A'} | ${item.treatment_processes?.treatment_methods?.method ?? '—'}`;
        case 'requirements':
            return `Est: ${item.est_req_per_month ?? '—'} kg/mo | ${item.status ?? '—'}`;
    }
}

function getRoute(category: Category, item: any): string {
    switch (category) {
        case 'products': return `/product/${item.id}`;
        case 'waste': return `/waste/${item.id}`;
        case 'services': return `/treatment/${item.id}`;
        case 'requirements': return `/requirement/${item.id}`;
    }
}

export default function ResourcesScreen() {
    const { user } = useAuth();
    const [active, setActive] = useState<Category>('products');
    const { data = [], isLoading, error } = useUserData(active, user?.id ?? '');

    return (
        <View style={styles.container}>
            {/* Left menu */}
            <View style={styles.menu}>
                {CATEGORIES.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.menuItem, active === cat && styles.menuItemActive]}
                        onPress={() => setActive(cat)}
                    >
                        <Text style={[styles.menuText, active === cat && styles.menuTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Right panel */}
            <View style={styles.panel}>
                <Text style={styles.panelHeader}>{active}</Text>
                {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
                {!!error && <Text style={styles.error}>{error.message}</Text>}
                {!isLoading && !error && (
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.listItem} onPress={() => router.push(getRoute(active, item) as any)}>
                                <Text style={styles.listText}>{getLabel(active, item)}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<Text style={styles.empty}>No entries found.</Text>}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row' },
    menu: { width: 110, borderRightWidth: 1, borderColor: '#ccc', padding: 8, gap: 8 },
    menuItem: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 6 },
    menuItemActive: { backgroundColor: '#000' },
    menuText: { fontSize: 12, textAlign: 'center' },
    menuTextActive: { color: '#fff' },
    panel: { flex: 1, padding: 12, gap: 8 },
    panelHeader: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    listItem: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8 },
    listText: { fontSize: 13 },
    error: { color: 'red', fontSize: 13 },
    empty: { color: '#999', fontSize: 13, marginTop: 20, textAlign: 'center' },
});