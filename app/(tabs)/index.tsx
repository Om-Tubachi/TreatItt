import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconBell from '../../components/assets/icons/Bell.svg';
import IconMenu from '../../components/assets/icons/HamBurger.svg';
import IconPin from '../../components/assets/icons/LocationPin.svg';
import Logo from '../../components/assets/icons/Logo.svg';
import IconProfile from '../../components/assets/icons/Profile.svg';
import IconRecycle from '../../components/assets/icons/RecycleHome.svg';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { appBg, card, colors, fontSize, layout, radius, typography } from '../../constants/theme';
import { useAuth } from '../../context/auth';
import { useUserSearch } from '../../hooks/useUsers';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // Location bar <-> search bar toggle. Tapping the bar switches it into search
  // mode in place; tapping the pin icon (now a back arrow) or the backdrop below
  // the dropdown reverts it — no separate search component mounted elsewhere.
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results = [], isFetching } = useUserSearch(debounced);
  const showDropdown = searchActive && debounced.trim().length >= 2;

  const activateSearch = () => {
    setSearchActive(true);
    // focus after the input actually mounts/becomes editable
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const deactivateSearch = () => {
    setSearchActive(false);
    setQuery('');
    setDebounced('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><IconMenu width={22} height={22} /></TouchableOpacity>
        <Logo width={40} height={40} />
        <View style={styles.headerRight}>
          <TouchableOpacity><IconBell width={22} height={22} /></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/screens/profile/${user?.id}` as any)}>
            <IconProfile width={22} height={22} />
          </TouchableOpacity>
        </View>
      </View>

      {user && <Text style={styles.greeting}> Hi, {user?.first_name ?? user?.username}</Text>}

      {/* Location bar / inline username search */}
      <View style={styles.searchWrap}>
        <TouchableOpacity
          style={styles.locationBar}
          activeOpacity={searchActive ? 1 : 0.7}
          onPress={searchActive ? undefined : activateSearch}
        >
          {searchActive ? (
            <TouchableOpacity onPress={deactivateSearch} hitSlop={8}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          ) : (
            <IconPin width={16} height={16} />
          )}

          {searchActive ? (
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search by username..."
              placeholderTextColor={colors.placeholder}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          ) : (
            <Text style={styles.locationText}>{user?.address ?? 'Set your location'}</Text>
          )}
        </TouchableOpacity>

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
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }: { item: any }) => (
                  <TouchableOpacity
                    style={styles.resultRow}
                    onPress={() => {
                      deactivateSearch();
                      router.push(`/screens/profile/${item.id}` as any);
                    }}
                  >
                    <Avatar firstName={item.first_name} lastName={item.last_name} />
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultName}>
                        {[item.first_name, item.last_name].filter(Boolean).join(' ') || item.username}
                      </Text>
                      {item.company_name ? <Text style={styles.resultCompany}>{item.company_name}</Text> : null}
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

      {/* FRP Guide Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Discover the FRP Guide{'\n'}in app</Text>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/screens/frp' as any)}
        >
          <Text style={styles.checkoutText}>Check out</Text>
        </TouchableOpacity>
      </View>

      {/* Manufacturing Processes Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Discover the Manufacturing{'\n'}processes</Text>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/screens/mfg-process' as any)}
        >
          <Text style={styles.checkoutText}>Check out</Text>
        </TouchableOpacity>
      </View>

      {/* Green promo card */}
      <View style={styles.promoCard}>
        <View style={styles.promoLeft}>
          <Text style={styles.promoSub}>Recycle Today</Text>
          <Text style={styles.promoTitle}>Discover all Recycling{'\n'}Services</Text>
          <TouchableOpacity
            style={styles.discoverBtn}
            onPress={() => router.push('/screens/recycling' as any)}
          >
            <Text style={styles.discoverText}>Discover</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 56, opacity: 0.8 }}><IconRecycle width={56} height={56} opacity={0.8} /></Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: appBg },
  content: { paddingHorizontal: layout.screenPadH, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 16 },
  menuIcon: { fontSize: 20 },
  logoPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary },
  headerRight: { flexDirection: 'row', gap: 8 },

  greeting: { fontFamily: typography.heading, fontSize: fontSize.xl, color: colors.black, marginBottom: 12 },

  searchWrap: { marginBottom: 20, position: 'relative', zIndex: 10 },
  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, gap: 8, borderWidth: card.borderWidth, borderColor: card.border },
  locationText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },
  backArrow: { fontSize: 20, color: colors.black, lineHeight: 20 },
  searchInput: { flex: 1, fontFamily: typography.body, fontSize: fontSize.sm, color: colors.black, padding: 0 },

  dropdown: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: card.borderWidth, borderColor: card.border, marginTop: 6, maxHeight: 320, overflow: 'hidden' },
  hint: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body, padding: 16, textAlign: 'center' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 0.5, borderBottomColor: card.border },
  resultInfo: { flex: 1, gap: 2 },
  resultName: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
  resultCompany: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },

  infoCard: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  infoText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black, flex: 1 },
  checkoutBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 8 },
  checkoutText: { fontFamily: typography.bodyMed, fontSize: fontSize.xs, color: colors.white },

  promoCard: { backgroundColor: card.greenBg, borderRadius: card.greenRadius, padding: 20, flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  promoLeft: { flex: 1, gap: 6 },
  promoSub: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.brandDeep, fontStyle: 'italic' },
  promoTitle: { fontFamily: typography.heading, fontSize: fontSize.lg, color: colors.black },
  discoverBtn: { backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 4 },
  discoverText: { fontFamily: typography.bodyMed, fontSize: fontSize.sm, color: colors.black },
});