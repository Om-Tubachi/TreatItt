import { useRouter } from 'expo-router'; // 1. Import useRouter
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconBell from '../../components/assets/icons/Bell.svg';
import IconMenu from '../../components/assets/icons/HamBurger.svg';
import IconPin from '../../components/assets/icons/LocationPin.svg';
import Logo from '../../components/assets/icons/Logo.svg';
import IconProfile from '../../components/assets/icons/Profile.svg';
import IconRecycle from '../../components/assets/icons/RecycleHome.svg';
import { appBg, card, colors, fontSize, layout, radius, typography } from '../../constants/theme';
import { useAuth } from '../../context/auth';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter(); // 2. Initialize the router

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><IconMenu width={22} height={22} /></TouchableOpacity>
        <Logo width={40} height={40} />
        <View style={styles.headerRight}>
          <TouchableOpacity><IconBell width={22} height={22} /></TouchableOpacity>
          
          {/* PROFILE BUTTON */}
          <TouchableOpacity onPress={() => router.push(`/screens/profile/${user?.id}` as any)}>
            <IconProfile width={22} height={22} />
          </TouchableOpacity>
        </View>
      </View>
      
      {user && <Text style={styles.greeting}> Hi, {user?.first_name ?? user?.username}</Text>}

      {/* Location bar */}
      <View style={styles.locationBar}>
        <Text><IconPin width={16} height={16} /></Text>
        <Text style={styles.locationText}>{user?.address ?? 'Set your location'}</Text>
      </View>

      {/* FRP Guide Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Discover the FRP Guide{'\n'}in app</Text>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => router.push('/screens/frp' as any)} // FRP Route
        >
          <Text style={styles.checkoutText}>Check out</Text>
        </TouchableOpacity>
      </View>

      {/* Manufacturing Processes Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Discover the Manufacturing{'\n'}processes</Text>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => router.push('/screens/mfg-process' as any)} // MFG Process Route
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
            onPress={() => router.push('/screens/recycling/index' as any)} // Recycling Route
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

  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, gap: 8, marginBottom: 20, borderWidth: card.borderWidth, borderColor: card.border },
  locationText: { fontFamily: typography.body, fontSize: fontSize.sm, color: colors.body },

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