import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAllProducts } from '../../hooks/useProducts';
import { useAllRecyclers } from '../../hooks/useRecyclers';
import { useAllRequirements } from '../../hooks/useRequirements';
import { useAllTreatments } from '../../hooks/useTreatments';
import { useAllWaste } from '../../hooks/useWastes';

type Category = 'products' | 'waste sources' | 'recycler' | 'treatments' | 'requirements';

const CATEGORIES: Category[] = ['products', 'waste sources', 'recycler', 'treatments', 'requirements'];

function useActiveData(category: Category) {
    const products = useAllProducts({ enabled: category === 'products' });
    const wastes = useAllWaste({ enabled: category === 'waste sources' });
    const recyclers = useAllRecyclers({ enabled: category === 'recycler' });
    const treatments = useAllTreatments({ enabled: category === 'treatments' });
    const requirements = useAllRequirements({ enabled: category === 'requirements' });

    const map: Record<Category, { data: any[]; isLoading: boolean; error: any }> = {
        'products': products,
        'waste sources': wastes,
        'recycler': recyclers,
        'treatments': treatments,
        'requirements': requirements,
    };
    return map[category];
}

function getLabel(category: Category, item: any): string {
    switch (category) {
        case 'products':
            return `${item.frp?.composition?.composition_name ?? 'N/A'} | ${item.frp?.category?.category_name ?? 'N/A'} | ${item.description ?? ''}`;
        case 'waste sources':
            return `${item.frp?.category?.category_name ?? 'N/A'} | qty: ${item.quantity ?? '—'} | status: ${item.status ?? '—'}`;
        case 'recycler':
            return `Recycler — ${item.address ?? 'No address'}`;
        case 'treatments':
            return `${item.treatment_processes?.process ?? 'N/A'} | method: ${item.treatment_processes?.treatment_methods?.method ?? '—'}`;
        case 'requirements':
            return `Est: ${item.est_req_per_month ?? '—'} kg/mo | status: ${item.status ?? '—'}`;
    }
}

function getRoute(category: Category, item: any): string {
    switch (category) {
        case 'products': return `/product/${item.id}`;
        case 'waste sources': return `/waste/${item.id}`;
        case 'recycler': return `/recycler/${item.u_id ?? item.id}`;
        case 'treatments': return `/treatment/${item.id}`;
        case 'requirements': return `/requirement/${item.id}`;
    }
}

export default function MarketplaceScreen() {
    const [active, setActive] = useState<Category>('products');
    const { data = [], isLoading, error } = useActiveData(active);

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
    menu: { width: 120, borderRightWidth: 1, borderColor: '#ccc', padding: 8, gap: 8 },
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