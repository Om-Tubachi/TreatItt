/**
 * FRP Recycle — Design System Tokens
 * Source: Lovable-generated CSS (styles.css)
 * Converted from oklch → hex for React Native compatibility
 *
 * RULE: Never write a raw color, spacing value, radius, or shadow
 * anywhere in the app. Every value comes from here.
 */

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────

export const colors = {
  // Core
  background: '#F3F6F8',       // oklch(0.97 0.005 210) — light blue-gray app bg
  foreground: '#1C2033',       // oklch(0.18 0.02 250)  — near-black navy text
  card: '#FFFFFF',             // oklch(1 0 0)
  cardForeground: '#1C2033',

  // Primary — deep industrial teal
  primary: '#1B6B5A',          // oklch(0.45 0.12 185)
  primaryForeground: '#FAFCFC',

  // Secondary — cool gray
  secondary: '#EEF0F6',        // oklch(0.95 0.008 250)
  secondaryForeground: '#3D4260',

  // Muted
  muted: '#F0F1F6',            // oklch(0.95 0.005 250)
  mutedForeground: '#727898',  // oklch(0.55 0.02 250)

  // Accent
  accent: '#E8ECF2',           // oklch(0.93 0.01 210)
  accentForeground: '#283048',

  // Semantic
  destructive: '#E04E35',      // oklch(0.58 0.22 27)
  destructiveForeground: '#FAFCFC',

  // Borders & inputs
  border: '#E3E7EE',           // oklch(0.91 0.008 250)
  input: '#ECEEF5',            // oklch(0.93 0.008 250)
  ring: '#1B6B5A',

  // Surface dark — for stat cards, banners, dark sections
  surfaceDark: '#1E2338',      // oklch(0.22 0.025 250)
  surfaceDarkForeground: '#F3F6F8',

  // Status
  success: '#2EA96B',          // oklch(0.62 0.17 155) — green
  successForeground: '#FFFFFF',
  warning: '#D4A820',          // oklch(0.75 0.15 75)  — amber
  warningForeground: '#2A2008',
  info: '#5468A8',             // oklch(0.55 0.1 250)  — slate blue
  infoForeground: '#FFFFFF',

  // FAB
  fab: '#1B6B5A',
  fabForeground: '#FFFFFF',

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarForeground: '#727898',
  tabBarActive: '#1B6B5A',

  // Badges — pill status indicators
  badge: {
    listed: {
      bg: '#D6F0E4',
      text: '#1A6B42',
    },
    pending: {
      bg: '#FDF0CE',
      text: '#7A5C00',
    },
    recycled: {
      bg: '#E0E3ED',
      text: '#3D4568',
    },
    active: {
      bg: '#D6F0E4',
      text: '#1A6B42',
    },
    full: {
      bg: '#FAE0DB',
      text: '#8C2A18',
    },
  },

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────
// Font: Inter (load via expo-font or @expo-google-fonts/inter)

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    // Fallback for before font loads
    system: 'System',
  },

  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 34,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// ─────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────
// Base unit: 4px. Scale is multiples.

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,   // standard horizontal screen padding
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,

  // Semantic aliases
  screenPadding: 16,
  cardPadding: 16,
  cardPaddingV: 14,
  sectionGap: 12,
  itemGap: 8,
} as const;

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────
// Base --radius: 0.75rem = 12px

export const radius = {
  sm: 8,    // calc(12 - 4)
  md: 10,   // calc(12 - 2)
  lg: 12,   // base
  xl: 16,   // calc(12 + 4)
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  full: 9999, // pill shapes
} as const;

// ─────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────
// React Native shadows require separate iOS + Android props.
// Use the spread pattern: <View style={[styles.card, shadows.card]} />

export const shadows = {
  // card-elevation — subtle lift
  card: {
    shadowColor: '#1C2033',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },

  // card-elevation-md
  cardMd: {
    shadowColor: '#1C2033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // card-elevation-lg
  cardLg: {
    shadowColor: '#1C2033',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  },

  // fab-shadow — teal tinted
  fab: {
    shadowColor: '#1B6B5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },

  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

// ─────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────

export const layout = {
  tabBarHeight: 64,
  fabSize: 56,
  fabBottom: 20,       // distance from bottom of screen
  headerHeight: 56,
  sidebarWidth: 96,
  statCardHeight: 110,
} as const;

// ─────────────────────────────────────────────
// COMPONENT TOKENS
// ─────────────────────────────────────────────
// Pre-composed style objects for common components.
// Import these directly into StyleSheet.create() calls.

export const componentTokens = {
  input: {
    backgroundColor: colors.input,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.foreground,
  },

  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.mutedForeground,
    marginBottom: spacing[1],
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    ...shadows.card,
  },

  screenHeader: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    backgroundColor: colors.background,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing[4],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  primaryButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },
} as const;

// ─────────────────────────────────────────────
// DEFAULT EXPORT — convenience bundle
// ─────────────────────────────────────────────

const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  layout,
  componentTokens,
} as const;

export default theme;
