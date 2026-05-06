import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProfileRow } from '../../../components/ui/ProfileRow';
import { SubmitButton } from '../../../components/ui/SubmitButton';
import { colors, radius, shadows, spacing, typography } from '../../../constants/theme';
import { useAuth } from '../../../context/auth';

export default function Me() {
  const { user } = useAuth();

  const initials = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map(n => n![0].toUpperCase())
    .join('') || '??';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.screenTitle}>Profile</Text>

      {/* Avatar block */}
      <View style={styles.avatarBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>
          {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || '—'}
        </Text>
        <Text style={styles.email}>{user?.email ?? '—'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Pro Member</Text>
        </View>
      </View>

      {/* Detail card */}
      <View style={[styles.card, shadows.card]}>
        <ProfileRow label="Username" value={user?.username} />
        <ProfileRow label="First Name" value={user?.first_name} />
        <ProfileRow label="Middle Name" value={user?.middle_name} />
        <ProfileRow label="Last Name" value={user?.last_name} />
        <ProfileRow label="Email" value={user?.email} />
        <ProfileRow label="Company" value={user?.company_name} />
        <ProfileRow label="Designation" value={user?.designation} />
        <ProfileRow label="Contact" value={user?.contact_number} />
        <ProfileRow label="Address" value={user?.address} />
        <ProfileRow
          label="Verified"
          value={user?.is_verified ? '✓ Verified' : 'Unverified'}
          valueColor={user?.is_verified ? colors.success : colors.mutedForeground}
          isLast
        />
      </View>

      {/* Resources button */}
      <SubmitButton
        label="Resources"
        onPress={() => router.push('/screens/resources')}
        style={styles.resourcesBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenPadding, gap: spacing[5], paddingBottom: 100 },
  screenTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.foreground,
    marginTop: spacing[2],
  },
  avatarBlock: { alignItems: 'center', gap: spacing[2], paddingVertical: spacing[4] },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryForeground,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.foreground,
  },
  email: { fontSize: typography.fontSize.sm, color: colors.mutedForeground },
  roleBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    marginTop: spacing[1],
  },
  roleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentForeground,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.cardPadding,
  },
  resourcesBtn: { marginTop: spacing[2] },
});