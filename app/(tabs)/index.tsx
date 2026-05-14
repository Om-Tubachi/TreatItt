import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HamburgerMenu from '../../components/ui/HamburgerMenu';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.hamButton}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.hamLine} />
            <View style={[styles.hamLine, { width: 16 }]} />
            <View style={styles.hamLine} />
          </TouchableOpacity>
        </View>

        {/* About App Banner */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>FRP Recycle</Text>
          <Text style={styles.aboutBody}>
            The industrial marketplace connecting waste generators, recyclers, and
            collectors across the Indian composites industry. List your FRP waste,
            find recyclers, and close the loop.
          </Text>
        </View>

        {/* Buy / Sell */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionCard, styles.buyCard]}
            onPress={() => router.push('/(tabs)/MarketPlace')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionLabel}>Buy</Text>
            <Text style={styles.actionSub}>Find FRP materials{'\n'}& recycled products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.sellCard]}
            onPress={() => router.push('/(tabs)/MarketPlace')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionLabel}>Sell</Text>
            <Text style={styles.actionSub}>List your FRP waste{'\n'}& connect with buyers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <HamburgerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={[
          { label: 'Register as Recycler', onPress: () => router.push('/recycler/create') },
          { label: 'Register as Collector', onPress: () => router.push('/collector/create') },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
    gap: spacing[4],
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  hamButton: {
    gap: 5,
    padding: spacing[1],
  },
  hamLine: {
    width: 22,
    height: 2,
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
  },
  aboutCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.xl,
    padding: spacing[5],
    gap: spacing[2],
    ...shadows.card,
  },
  aboutTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  aboutBody: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionCard: {
    flex: 1,
    borderRadius: radius.xl,
    padding: spacing[5],
    gap: spacing[1],
    minHeight: 140,
    justifyContent: 'flex-end',
    ...shadows.cardMd,
  },
  buyCard: {
    backgroundColor: colors.primary,
  },
  sellCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionLabel: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.foreground,
  },
  actionSub: {
    fontSize: typography.fontSize.xs,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
});