import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';

import IconFilter from '../../components/assets/icons/HamBurger.svg';
import IconSearch from '../../components/assets/icons/search.svg';
import { FilterSheet } from '../../components/organisms/FilterSheet';
import { MapInfoCard } from '../../components/organisms/MapinfoCard';

// Import all specific structural entity cards
import { ProductCard } from '../../components/organisms/ProductCard';
import { RecyclingCard } from '../../components/organisms/RecyclingCard';
import { RequirementCard } from '../../components/organisms/RequirementCard';
import { WasteCard } from '../../components/organisms/WasteCard';

import { appBg, card, colors, fontSize, layout, radius, typography } from '../../constants/theme';
import { useFilters } from '../../context/filter';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useMapPins } from '../../hooks/useMapPins';
import { fetchRoute, RouteResult } from '../../services/routing';
import { MapPin, postSearch } from '../../services/search';

const BENGALURU_FALLBACK = {
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

// ⭐ Auto-zoom tuning constants
const MIN_DELTA = 0.01;      // don't zoom in tighter than this even if all pins are on top of each other
const MAX_DELTA = 4;         // don't zoom out further than this even if a pin is very far away
const PADDING_FACTOR = 1.4;  // headroom so the farthest pin isn't glued to the screen edge

type ViewMode = 'map' | 'list';

export default function MapScreen() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null); // ⭐ Map reference for dynamic camera manipulation
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

    // Explicitly parse coordinates to Numbers to prevent native float casting errors
    const location = latitude != null && longitude != null ? {
        latitude: Number(latitude),
        longitude: Number(longitude)
    } : null;

    // 1. Spatial Pins Query (Fast, un-hydrated coordinate objects)
    const { data: pinData, isLoading: isPinsLoading } = useMapPins(filters, location);
    const pins = pinData?.pins ?? [];

    // Make Search actually work by filtering the visible map pins locally
    const filteredPins = useMemo(() => {
        if (!search.trim()) return pins;
        const query = search.toLowerCase();
        return pins.filter((pin) => {
            // Adjust property fallbacks depending on what fields your MapPin object yields
            const title = (pin.displayName || pin.entityType || '').toLowerCase();
            return title.includes(query);
        });
    }, [pins, search]);

    // 2. Full Search Hydrated Backend Query for the List Tab
    const { data: searchData, isLoading: isSearchLoading } = useQuery({
        queryKey: ['search', 'full-results', filters],
        queryFn: () => postSearch(filters),
        enabled: viewMode === 'list' && filters.entityTypes.length > 0,
    });
    const fullResults = searchData?.results ?? [];

    // ⭐ Lightweight signature of the current pin set — only changes when pins are added/removed,
    // not on every re-render, so the auto-zoom effect below doesn't fire needlessly.
    const pinsSignature = useMemo(
        () =>
            filteredPins
                .map((p) => (p.kind === 'actor' ? `a${p.userId}` : `${p.entityType}${p.entityId}`))
                .sort()
                .join(','),
        [filteredPins]
    );

    // ⭐ Auto-zoom: always center on the user's location, size the zoom to comfortably
    // contain the farthest visible pin. Re-runs only when the pin set or location changes —
    // never when a user taps a pin (that's handled separately in handlePinPress).
    useEffect(() => {
        if (!location || !mapRef.current) return;
        if (filteredPins.length === 0) return;

        let maxLatDelta = 0;
        let maxLngDelta = 0;

        filteredPins.forEach((pin) => {
            if (pin.latitude == null || pin.longitude == null) return;
            const lat = Number(pin.latitude);
            const lng = Number(pin.longitude);
            if (isNaN(lat) || isNaN(lng)) return;

            maxLatDelta = Math.max(maxLatDelta, Math.abs(lat - location.latitude));
            maxLngDelta = Math.max(maxLngDelta, Math.abs(lng - location.longitude));
        });

        // No usable pin coordinates found — nothing to fit to
        if (maxLatDelta === 0 && maxLngDelta === 0) return;

        const latitudeDelta = Math.min(Math.max(maxLatDelta * 2 * PADDING_FACTOR, MIN_DELTA), MAX_DELTA);
        const longitudeDelta = Math.min(Math.max(maxLngDelta * 2 * PADDING_FACTOR, MIN_DELTA), MAX_DELTA);

        mapRef.current.animateToRegion(
            {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta,
                longitudeDelta,
            },
            500
        );
        // Only re-run when the actual set of pins changes, or location becomes available/changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pinsSignature, location?.latitude, location?.longitude]);

    // Pan camera smoothly to selected pin (still overrides the auto-zoom framing on tap)
    const handlePinPress = (pin: MapPin) => {
        setSelectedPin(pin);
        setRoute(null);

        if (pin.latitude && pin.longitude && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: Number(pin.latitude),
                longitude: Number(pin.longitude),
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }, 400);
        }
    };

    const handleDismiss = () => {
        setSelectedPin(null);
        setRoute(null);
    };

    const handleCardPress = async () => {
        if (!selectedPin) return;

        if (location) {
            try {
                const r = await fetchRoute(
                    { lat: location.latitude, lng: location.longitude },
                    { lat: Number(selectedPin.latitude), lng: Number(selectedPin.longitude) }
                );
                setRoute(r);

                // Fit the viewport to show both the user location and destination when routing
                if (mapRef.current) {
                    mapRef.current.fitToCoordinates([
                        { latitude: location.latitude, longitude: location.longitude },
                        { latitude: Number(selectedPin.latitude), longitude: Number(selectedPin.longitude) }
                    ], {
                        edgePadding: { top: 140, right: 50, bottom: 280, left: 50 }, // Padding ensures UI card overlays don't block the path
                        animated: true,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch route tracking info:", error);
            }
        }

        const path =
            selectedPin.kind === 'actor'
                ? `/screens/profile/${selectedPin.userId}`
                : `/screens/${selectedPin.entityType}/${selectedPin.entityId}`;

        setTimeout(() => {
            router.push(path as any);
        }, 300);
    };

    // Helper component injector that dynamically maps row elements to card structures
    const renderItemRow = ({ item }: { item: any }) => {
        const type = item.__entityType || (filters.entityTypes.length === 1 ? filters.entityTypes[0] : 'product');
        const targetPath = `/screens/${type}/${item.id}`;

        switch (type) {
            case 'waste':
                return <WasteCard item={item} onPress={() => router.push(targetPath as any)} />;
            case 'requirement':
                return <RequirementCard item={item} onPress={() => router.push(targetPath as any)} />;
            case 'recycling':
                return <RecyclingCard item={item} onPress={() => router.push(targetPath as any)} />;
            case 'product':
            default:
                return <ProductCard item={item} onPress={() => router.push(targetPath as any)} />;
        }
    };

    // Sanitize route coordinates with explicit Number casting
    const routeCoordinates = route?.coordinates?.map(([lng, lat]) => {
        const parsedLat = Number(lat);
        const parsedLng = Number(lng);
        return {
            latitude: isNaN(parsedLat) ? 0 : parsedLat,
            longitude: isNaN(parsedLng) ? 0 : parsedLng,
        };
    }) || [];

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.searchBar}>
                    <IconSearch width={18} height={18} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search pins by type/title..."
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
                    <MapView
                        ref={mapRef} // ⭐ Attached ref
                        style={styles.map}
                        mapType="none"
                        initialRegion={location ? {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        } : BENGALURU_FALLBACK}
                    >
                        <UrlTile
                            urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                            maximumZ={20}
                            flipY={false}
                        />

                        {location && (
                            <Marker
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude
                                }}
                                title="My Location"
                            >
                                <View style={styles.meDot} />
                            </Marker>
                        )}

                        {/* Render filtered pins instead of original raw payload */}
                        {filteredPins.map((pin) => {
                            if (pin.latitude == null || pin.longitude == null) return null;

                            const lat = Number(pin.latitude);
                            const lng = Number(pin.longitude);
                            if (isNaN(lat) || isNaN(lng)) return null;

                            const isActor = pin.kind === 'actor';
                            const id = isActor ? `actor-${pin.userId}` : `entity-${pin.entityType}-${pin.entityId}`;

                            return (
                                <Marker
                                    key={id}
                                    coordinate={{ latitude: lat, longitude: lng }}
                                    onPress={() => handlePinPress(pin)}
                                    anchor={{ x: 0.5, y: 1 }}
                                    tracksViewChanges={false}
                                >
                                    <View style={styles.pinWrap}>
                                        <View style={[styles.pinHead, isActor && styles.pinHeadActor]}>
                                            <View style={styles.pinDot} />
                                        </View>
                                        <View style={[styles.pinPointer, isActor && styles.pinPointerActor]} />
                                    </View>
                                </Marker>
                            );
                        })}

                        {route && routeCoordinates.length > 0 && (
                            <Polyline
                                coordinates={routeCoordinates}
                                strokeColor={colors.primaryDark || '#2c3e50'}
                                strokeWidth={4}
                            />
                        )}
                    </MapView>

                    {/* Feedback UI for empty maps / loading states */}
                    {isPinsLoading && (
                        <View style={styles.mapStatusOverlay}>
                            <Text style={styles.mapStatusText}>Loading Map Pins...</Text>
                        </View>
                    )}

                    {!isPinsLoading && filteredPins.length === 0 && (
                        <View style={styles.mapStatusOverlay}>
                            <Text style={styles.mapStatusText}>No map pins found matching filters/search.</Text>
                        </View>
                    )}

                    {selectedPin && (
                        <View style={styles.infoCardOverlay} pointerEvents="box-none">
                            <MapInfoCard
                                pin={selectedPin}
                                distanceMeters={route?.distanceMeters}
                                onPress={handleCardPress}
                                onDismiss={handleDismiss}
                            />
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.listContainer}>
                    {isSearchLoading ? (
                        <View style={styles.listPlaceholder}>
                            <Text style={styles.listPlaceholderText}>Loading results…</Text>
                        </View>
                    ) : fullResults.length === 0 ? (
                        <View style={styles.listPlaceholder}>
                            <Text style={styles.listPlaceholderText}>No marketplace entries match your active filters.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={fullResults}
                            keyExtractor={(item) => `${item.id}-${item.__entityType || 'ent'}`}
                            contentContainerStyle={styles.listContent}
                            renderItem={renderItemRow}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            )}

            <FilterSheet
                visible={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                showActorLayer={viewMode === 'map'}
                showDistanceSlider={viewMode === 'map'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    pinWrap: { alignItems: 'center' },
    pinHead: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 3,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    pinHeadActor: { borderColor: colors.primaryDark || '#d35400' },
    pinDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    pinPointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 11,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: colors.primary,
        marginTop: -2,
    },
    pinPointerActor: { borderTopColor: colors.primaryDark || '#d35400' },

    infoCardOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 24,
        paddingHorizontal: layout.screenPadH,
    },
    // Overlay style for absolute contextual visibility inside the map
    mapStatusOverlay: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: radius.md || 8,
    },
    mapStatusText: {
        color: '#ffffff',
        fontSize: fontSize.xs,
        fontFamily: typography.bodyMed
    },
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
    listContainer: { flex: 1 },
    listContent: { paddingHorizontal: layout.screenPadH, paddingBottom: 32 },
    listPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
    listPlaceholderText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
});