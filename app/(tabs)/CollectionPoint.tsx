import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAllCollectors } from '../../hooks/useCollectors';

export default function CollectionPointsScreen() {
    const { data: collectors = [], isLoading, error } = useAllCollectors();

    return (
        <View style={styles.container}>
            {/* Map placeholder — swap with MapView once react-native-maps is installed */}
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>map</Text>
            </View>

            {/* List of collection points */}
            {isLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
            {!!error && <Text style={styles.error}>{error.message}</Text>}
            {!isLoading && !error && (
                <FlatList
                    data={collectors}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => router.push(`/collector/${item.id}` as any)}
                        >
                            <Text style={styles.listText}>
                                {item.users?.username ?? item.u_id ?? 'Collection Point'}
                            </Text>
                            {item.address && <Text style={styles.subText}>{item.address}</Text>}
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>No collection points found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapPlaceholder: { height: 260, borderWidth: 1, borderColor: '#ccc', margin: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
    mapText: { fontSize: 18, color: '#999' },
    list: { paddingHorizontal: 12 },
    listItem: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8 },
    listText: { fontSize: 14 },
    subText: { fontSize: 12, color: '#666', marginTop: 2 },
    error: { color: 'red', padding: 16 },
    empty: { color: '#999', fontSize: 13, marginTop: 20, textAlign: 'center' },
});