// import React, { useRef, useState } from 'react';
// import {
//   Linking,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
// import { useAllCollectors } from '../../hooks/useCollectors';

// const INITIAL_REGION = {
//     latitude: 18.628,
//     longitude: 73.776,
//     latitudeDelta: 0.12,
//     longitudeDelta: 0.12,
// };

// const SHEET_MIN = 320;

// export default function CollectionPointScreen() {
//     const { data: collectors = [] } = useAllCollectors();
//     const [search, setSearch] = useState('');
//     const mapRef = useRef<MapView>(null);

//     const filtered = collectors.filter(c =>
//         (c.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
//         (c.type?.toLowerCase() || '').includes(search.toLowerCase())
//     );

//     const flyTo = (lat: number, lng: number) => {
//         mapRef.current?.animateToRegion(
//             { latitude: lat - 0.01, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 },
//             600
//         );
//     };

//     return (
//         <View style={styles.screen}>
//             <MapView
//                 ref={mapRef}
//                 style={styles.map}
//                 provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
//                 initialRegion={INITIAL_REGION}
//                 showsUserLocation
//                 showsMyLocationButton={false}
//             >
//                 {collectors.map(c => (
//                     <Marker 
//                         key={c.id} 
//                         coordinate={{ latitude: c.lat, longitude: c.lng }} 
//                         onPress={() => flyTo(c.lat, c.lng)}
//                     >
//                         <View style={styles.pin}>
//                             <Text style={styles.pinText}>♻</Text>
//                         </View>
//                     </Marker>
//                 ))}
//             </MapView>

//             <View style={styles.searchBar}>
//                 <Text style={styles.searchIcon}>🔍</Text>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search recycling centers..."
//                     placeholderTextColor={colors.mutedForeground}
//                     value={search}
//                     onChangeText={setSearch}
//                 />
//             </View>

//             <View style={[styles.sheet, shadows.cardLg]}>
//                 <View style={styles.sheetHandle} />
//                 <View style={styles.sheetHeader}>
//                     <Text style={styles.sheetTitle}>Nearby Centers</Text>
//                     <View style={styles.countBadge}>
//                         <Text style={styles.countText}>{filtered.length} found</Text>
//                     </View>
//                 </View>

//                 <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardList}>
//                     {filtered.map(center => (
//                         <View key={center.id} style={[styles.centerCard, shadows.card]}>
//                             <View style={styles.centerTop}>
//                                 <View style={styles.centerInfo}>
//                                     <Text style={styles.centerName}>{center.name}</Text>
//                                     <Text style={styles.centerType}>{center.type}</Text>
//                                 </View>
//                                 <Text style={styles.centerDist}>{center.distance} ↗</Text>
//                             </View>
//                             <View style={styles.centerAddress}>
//                                 <Text style={styles.pinEmoji}>📍</Text>
//                                 <Text style={styles.centerAddressText}>{center.address}</Text>
//                             </View>
//                             <View style={styles.centerActions}>
//                                 <TouchableOpacity
//                                     style={styles.directionsBtn}
//                                     onPress={() => Linking.openURL(
//                                         `https://maps.google.com/?q=$${center.lat},${center.lng}`
//                                     )}
//                                 >
//                                     <Text style={styles.directionsBtnText}>Directions →</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity
//                                     style={styles.phoneBtn}
//                                     onPress={() => Linking.openURL(`tel:${center.phone}`)}
//                                 >
//                                     <Text style={styles.phoneBtnText}>📞</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     ))}
//                 </ScrollView>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     screen: { flex: 1, backgroundColor: colors.background },
//     map: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
//     searchBar: {
//         position: 'absolute',
//         top: spacing[6],
//         left: spacing.screenPadding,
//         right: spacing.screenPadding,
//         backgroundColor: colors.card,
//         borderRadius: radius.full,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: spacing[4],
//         paddingVertical: spacing[3],
//         ...shadows.cardMd,
//     },
//     searchIcon: { fontSize: 16, marginRight: spacing[2] },
//     searchInput: {
//         flex: 1,
//         fontSize: typography.fontSize.base,
//         color: colors.foreground,
//     },
//     sheet: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: SHEET_MIN,
//         backgroundColor: colors.card,
//         borderTopLeftRadius: radius['3xl'],
//         borderTopRightRadius: radius['3xl'],
//         paddingTop: spacing[2],
//         paddingBottom: 100,
//     },
//     sheetHandle: {
//         width: 40, height: 4,
//         backgroundColor: colors.border,
//         borderRadius: 2,
//         alignSelf: 'center',
//         marginBottom: spacing[3],
//     },
//     sheetHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: spacing.screenPadding,
//         marginBottom: spacing[3],
//     },
//     sheetTitle: {
//         fontSize: typography.fontSize.xl,
//         fontWeight: typography.fontWeight.bold,
//         color: colors.foreground,
//     },
//     countBadge: {
//         backgroundColor: colors.accent,
//         paddingHorizontal: spacing[3],
//         paddingVertical: spacing[1],
//         borderRadius: radius.full,
//     },
//     countText: {
//         fontSize: typography.fontSize.xs,
//         fontWeight: typography.fontWeight.semiBold,
//         color: colors.primary,
//     },
//     cardList: { paddingHorizontal: spacing.screenPadding, gap: spacing[3] },
//     centerCard: {
//         backgroundColor: colors.background,
//         borderRadius: radius.xl,
//         padding: spacing.cardPadding,
//         gap: spacing[2],
//         marginBottom: spacing[2],
//     },
//     centerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//     centerInfo: { flex: 1 },
//     centerName: {
//         fontSize: typography.fontSize.base,
//         fontWeight: typography.fontWeight.semiBold,
//         color: colors.foreground,
//     },
//     centerType: {
//         fontSize: typography.fontSize.sm,
//         color: colors.mutedForeground,
//         marginTop: 1,
//     },
//     centerDist: {
//         fontSize: typography.fontSize.sm,
//         fontWeight: typography.fontWeight.semiBold,
//         color: colors.primary,
//     },
//     centerAddress: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
//     pinEmoji: { fontSize: 12 },
//     centerAddressText: { fontSize: typography.fontSize.sm, color: colors.mutedForeground, flex: 1 },
//     centerActions: { flexDirection: 'row', gap: spacing[2], marginTop: spacing[1] },
//     directionsBtn: {
//         backgroundColor: colors.surfaceDark,
//         borderRadius: radius.lg,
//         paddingVertical: spacing[2],
//         paddingHorizontal: spacing[5],
//         flex: 1,
//         alignItems: 'center',
//     },
//     directionsBtnText: {
//         color: colors.surfaceDarkForeground,
//         fontSize: typography.fontSize.sm,
//         fontWeight: typography.fontWeight.medium,
//     },
//     phoneBtn: {
//         backgroundColor: colors.secondary,
//         borderRadius: radius.lg,
//         paddingVertical: spacing[2],
//         paddingHorizontal: spacing[3],
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     phoneBtnText: { fontSize: 18 },
//     pin: {
//         backgroundColor: colors.primary,
//         width: 36, height: 36,
//         borderRadius: 18,
//         alignItems: 'center', justifyContent: 'center',
//         borderWidth: 2, borderColor: colors.white,
//     },
//     pinText: { fontSize: 16 },
// });

import React, { useRef, useState } from 'react';
import {
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
import { useAllCollectors } from '../../hooks/useCollectors';

// --- Dynamic Imports to prevent Web Bundling Crash ---
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const rnm = require('react-native-maps');
  MapView = rnm.default;
  Marker = rnm.Marker;
  PROVIDER_GOOGLE = rnm.PROVIDER_GOOGLE;
}

const INITIAL_REGION = {
  latitude: 18.628,
  longitude: 73.776,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

const SHEET_MIN = 320;

export default function CollectionPointScreen() {
  const { data: collectors = [] } = useAllCollectors();
  const [search, setSearch] = useState('');
  const mapRef = useRef<any>(null);

  const filtered = collectors.filter(c =>
    (c.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.type?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const flyTo = (lat: number, lng: number) => {
    mapRef.current?.animateToRegion(
      { latitude: lat - 0.01, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      600
    );
  };

  return (
    <View style={styles.screen}>
      {Platform.OS !== 'web' ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {collectors.map(c => (
            <Marker 
              key={c.id} 
              coordinate={{ latitude: c.lat, longitude: c.lng }} 
              onPress={() => flyTo(c.lat, c.lng)}
            >
              <View style={styles.pin}>
                <Text style={styles.pinText}>♻</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={[styles.map, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: colors.mutedForeground }}>Map view is disabled on Web</Text>
        </View>
      )}

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recycling centers..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={[styles.sheet, shadows.cardLg]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Nearby Centers</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length} found</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardList}>
          {filtered.map(center => (
            <View key={center.id} style={[styles.centerCard, shadows.card]}>
              <View style={styles.centerTop}>
                <View style={styles.centerInfo}>
                  <Text style={styles.centerName}>{center.name}</Text>
                  <Text style={styles.centerType}>{center.type}</Text>
                </View>
                <Text style={styles.centerDist}>{center.distance} ↗</Text>
              </View>
              <View style={styles.centerAddress}>
                <Text style={styles.pinEmoji}>📍</Text>
                <Text style={styles.centerAddressText}>{center.address}</Text>
              </View>
              <View style={styles.centerActions}>
                <TouchableOpacity
                  style={styles.directionsBtn}
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`)}
                >
                  <Text style={styles.directionsBtnText}>Directions →</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.phoneBtn}
                  onPress={() => Linking.openURL(`tel:${center.phone}`)}
                >
                  <Text style={styles.phoneBtnText}>📞</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  map: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  searchBar: {
    position: 'absolute',
    top: spacing[6],
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    ...shadows.cardMd,
  },
  searchIcon: { fontSize: 16, marginRight: spacing[2] },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.foreground,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_MIN,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
    paddingTop: spacing[2],
    paddingBottom: 100,
  },
  sheetHandle: {
    width: 40, height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing[3],
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing[3],
  },
  sheetTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.foreground,
  },
  countBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },
  countText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
  },
  cardList: { paddingHorizontal: spacing.screenPadding, gap: spacing[3] },
  centerCard: {
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  centerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  centerInfo: { flex: 1 },
  centerName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.foreground,
  },
  centerType: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
    marginTop: 1,
  },
  centerDist: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
  },
  centerAddress: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  pinEmoji: { fontSize: 12 },
  centerAddressText: { fontSize: typography.fontSize.sm, color: colors.mutedForeground, flex: 1 },
  centerActions: { flexDirection: 'row', gap: spacing[2], marginTop: spacing[1] },
  directionsBtn: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[5],
    flex: 1,
    alignItems: 'center',
  },
  directionsBtnText: {
    color: colors.surfaceDarkForeground,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  phoneBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneBtnText: { fontSize: 18 },
  pin: {
    backgroundColor: colors.primary,
    width: 36, height: 36,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  pinText: { fontSize: 16 },
});