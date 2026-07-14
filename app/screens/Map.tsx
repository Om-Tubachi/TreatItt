import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconFilter from '../../components/assets/icons/HamBurger.svg';
import IconSearch from '../../components/assets/icons/search.svg';
import { FilterSheet } from '../../components/organisms/FilterSheet';
import { MapInfoCard } from '../../components/organisms/MapinfoCard';
import { appBg, card, colors, fontSize, layout, radius, typography } from '../../constants/theme';
import { useFilters } from '../../context/filter';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useMapPins } from '../../hooks/useMapPins';
import { fetchRoute, RouteResult } from '../../services/routing';
import { MapPin } from '../../services/search';

// vector-tile style required to match the Figma palette — raw OSM raster tiles
// won't get you there. MapTiler/Stadia both offer a free-tier key + custom style JSON.
const MAP_STYLE_URL = `https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_KEY}`;

const BENGALURU_FALLBACK: [number, number] = [77.5946, 12.9716];

type ViewMode = 'map' | 'list';

export default function MapScreen() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('map');
    const [search, setSearch] = useState('');
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
    const [route, setRoute] = useState<RouteResult | null>(null);

    const { filters } = useFilters();
    const { latitude, longitude, fetchLocation } = useCurrentLocation();
    useEffect(() => {
        fetchLocation();
    }, []);
    const location = latitude != null && longitude != null ? { latitude, longitude } : null;
    const { data, isLoading } = useMapPins(filters, location);
    const pins = data?.pins ?? [];

    const handlePinPress = (pin: MapPin) => {
        setSelectedPin(pin);
        setRoute(null);
    };

    const handleDismiss = () => {
        setSelectedPin(null);
        setRoute(null);
    };

    const handleCardPress = async () => {
        if (!selectedPin) return;

        if (location) {
            const r = await fetchRoute(
                { lat: location.latitude, lng: location.longitude },
                { lat: selectedPin.latitude, lng: selectedPin.longitude }
            );
            setRoute(r);
        }

        const path =
            selectedPin.kind === 'actor'
                ? `/screens/actor/${selectedPin.userId}`
                : `/screens/${selectedPin.entityType}/${selectedPin.entityId}`;
        router.push(path as any);
    };

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.searchBar}>
                    <IconSearch width={18} height={18} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search location"
                        placeholderTextColor={colors.placeholder}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterSheetOpen(true)}>
                    <IconFilter width={18} height={18} />
                </TouchableOpacity>
            </View>

            <View style={styles.ribbon}>
                <TouchableOpacity
                    style={[styles.ribbonTab, viewMode === 'map' && styles.ribbonTabActive]}
                    onPress={() => setViewMode('map')}
                >
                    <Text style={[styles.ribbonText, viewMode === 'map' && styles.ribbonTextActive]}>Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.ribbonTab, viewMode === 'list' && styles.ribbonTabActive]}
                    onPress={() => setViewMode('list')}
                >
                    <Text style={[styles.ribbonText, viewMode === 'list' && styles.ribbonTextActive]}>List</Text>
                </TouchableOpacity>
            </View>

            {viewMode === 'map' ? (
                <View style={styles.mapContainer}>
                    <Map style={styles.map} mapStyle={MAP_STYLE_URL}>
                        <Camera
                            initialViewState={{
                                center: location ? [location.longitude, location.latitude] : BENGALURU_FALLBACK,
                                zoom: 12,
                            }}
                        />

                        {location && (
                            <Marker id="me" lngLat={[location.longitude, location.latitude]}>
                                <View style={styles.meDot} />
                            </Marker>
                        )}

                        {pins.map((pin) => {
                            if (pin.latitude == null || pin.longitude == null) return null;
                            const id = pin.kind === 'actor' ? `actor-${pin.userId}` : `entity-${pin.entityType}-${pin.entityId}`;
                            return (
                                <Marker
                                    key={id}
                                    id={id}
                                    lngLat={[pin.longitude, pin.latitude]}
                                    onPress={() => handlePinPress(pin)}
                                >
                                    <View style={styles.pin} />
                                </Marker>
                            );
                        })}

                        {route && (
                            <GeoJSONSource
                                id="routeSource"
                                data={{
                                    type: 'Feature',
                                    geometry: { type: 'LineString', coordinates: route.coordinates },
                                    properties: {},
                                }}
                            >
                                <Layer
                                    type="line"
                                    id="routeLine"
                                    paint={{ 'line-color': colors.primaryDark, 'line-width': 4 }}
                                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                                />
                            </GeoJSONSource>
                        )}
                    </Map>

                    {selectedPin && (
                        <MapInfoCard
                            pin={selectedPin}
                            distanceMeters={route?.distanceMeters}
                            onPress={handleCardPress}
                            onDismiss={handleDismiss}
                        />
                    )}
                </View>
            ) : (
                <View style={styles.listPlaceholder}>
                    <Text style={styles.listPlaceholderText}>
                        {isLoading ? 'Loading…' : `${pins.length} results — reuse Marketplace's card components here`}
                    </Text>
                </View>
            )}

            <FilterSheet
                visible={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                showActorLayer
                showDistanceSlider
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: appBg },
    topBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: layout.screenPadH, paddingTop: 56, paddingBottom: 12 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.xl, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: card.borderWidth, borderColor: card.border },
    searchInput: { flex: 1, fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black },
    filterBtn: { width: 40, height: 40, borderRadius: radius.xl, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: card.borderWidth, borderColor: card.border },
    ribbon: { flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: layout.screenPadH, borderRadius: radius.xl, padding: 4, marginBottom: 12 },
    ribbonTab: { flex: 1, paddingVertical: 8, borderRadius: radius.xl, alignItems: 'center' },
    ribbonTabActive: { backgroundColor: colors.primary },
    ribbonText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.body },
    ribbonTextActive: { color: colors.white },
    mapContainer: { flex: 1 },
    map: { flex: 1 },
    meDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primaryDark, borderWidth: 2, borderColor: colors.white },
    pin: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white },
    listPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listPlaceholderText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
});