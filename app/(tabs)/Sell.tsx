import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appBg, authPrompt, card, colors, fontSize, layout, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/auth';

const OPTIONS = [
  { label: 'List Waste', sub: 'Post FRP waste available for collection', route: '/screens/forms/waste' },
  { label: 'List Product', sub: 'Sell recycled FRP material or products', route: '/screens/forms/product' },
  { label: 'Post Requirement', sub: 'Declare what FRP material you need', route: '/screens/forms/requirement' },
];

const RECYCLER_OPTIONS = [
  { label: 'Create Treatment Process', sub: 'Define method + process you use', route: '/screens/forms/treatment-process' },
  { label: 'Create Treatment', sub: 'Link FRP + process into a treatment', route: '/screens/forms/treatment' },
  { label: 'List Recycling Service', sub: 'Advertise your recycling capacity publicly', route: '/screens/forms/recycling-service' },
];

export default function SellScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // 2. Access auth state

  // 3. Optional loading state while determining auth tokens
  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.cardSub}>Loading profile...</Text>
      </View>
    );
  }

  // 4. Protected Screen Gate: Show structured sign-in redirect callout if no active session
  if (!user) {
    return (
      <View style={[styles.screen, styles.center]}>
        <View style={styles.authPromptCard}>
          <Text style={styles.authTitle}>Authentication Required</Text>
          <Text style={styles.authSub}>
            You need to be signed in to create marketplace listings or utilize recycler utility tools.
          </Text>
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={() => router.push('/(auth)/sign-in')}
            activeOpacity={0.8}
          >
            <Text style={styles.authButtonText}>Sign In / Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderCard = (item: typeof OPTIONS[0]) => (
    <TouchableOpacity key={item.route} style={styles.card} onPress={() => router.push(item.route as any)} activeOpacity={0.8}>
      <Text style={styles.cardTitle}>{item.label}</Text>
      <Text style={styles.cardSub}>{item.sub}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Sell / List</Text>
      </View>

      <Text style={styles.sectionLabel}>LISTINGS</Text>
      {OPTIONS.map(renderCard)}

      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>RECYCLER TOOLS</Text>
      {RECYCLER_OPTIONS.map(renderCard)}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: appBg, paddingHorizontal: layout.screenPadH },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 56, paddingBottom: 24 },
  title: { fontFamily: typography.heading, fontSize: fontSize.xxl, color: colors.black },
  sectionLabel: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  card: { backgroundColor: card.bg, borderRadius: card.radius, borderWidth: card.borderWidth, borderColor: card.border, padding: card.padding, marginBottom: 12, gap: 4 },
  cardTitle: { fontFamily: typography.bodyMed, fontSize: fontSize.md, color: colors.black },
  cardSub: { fontFamily: typography.body, fontSize: fontSize.xs, color: colors.body },
  
  // Follows design guidelines from theme.ts explicitly
  authPromptCard: {
    backgroundColor: authPrompt.bg,
    borderRadius: authPrompt.radius,
    borderWidth: authPrompt.borderWidth,
    borderColor: authPrompt.border,
    padding: authPrompt.padding,
    width: '100%',
    alignItems: 'center',
    gap: authPrompt.gap,
  },
  authTitle: {
    fontFamily: typography.heading,
    fontSize: fontSize.xl,
    color: colors.black,
    marginBottom:spacing.sm
  },
  authSub: {
    fontFamily: typography.bodyMed,
    fontSize: fontSize.sm,
    color: colors.body,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  authButton: {
    backgroundColor: authPrompt.buttonBg,
    // borderRadius: authPrompt.buttonRadius,
    paddingVertical: authPrompt.buttonPaddingV,
    paddingHorizontal: authPrompt.buttonPaddingH,
    width: '100%',
    alignItems: 'center',
  },
  authButtonText: {
    fontFamily: typography.bodyMed,
    fontSize: fontSize.sm,
    color: colors.white,
  },
});