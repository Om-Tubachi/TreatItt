export const colors = {
  primary: '#9DD549',
  primaryDark: '#6BB200',
  brandDeep: '#264E29',
  gradientStart: '#EFFFE2',
  gradientEnd: '#F7FEF2',
  heading: '#4D3E3E',
  body: 'rgba(0,0,0,0.70)',
  placeholder: 'rgba(0,0,0,0.50)',
  inputBorder: '#D8DADC',
  inputBg: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  error: '#E53E3E',
  tabsBackground: '#F5FFED'
};

export const typography = {
  heading: 'Poppins_700Bold',
  body: 'Inter_400Regular',
  bodyMed: 'Inter_500Medium',
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 50,
};

export const spacing = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  xxl: 32,
};

export const tabBar = {
  height: 80,
  borderRadius: 0,
  centerSize: 75,
  centerLift: 20,
  iconSize: 30,
  centerIconSize: 28,
  activeIconBg: 'rgba(255,255,255,0.25)',
  inactiveColor: colors.white,
  bg: colors.primary,
  centerBg: colors.white,
  centerColor: colors.primaryDark,
};

export const layout = {
  screenPadH: 20,
  buttonWidth: 353,
  buttonHeight: 56,
};

export const appBg = '#F5FFED';

export const card = {
  bg: '#FFFFFF',
  border: '#CDCDCD',
  borderWidth: 0.5,
  radius: 14,
  greenBg: 'rgba(157,213,73,0.80)',
  greenRadius: 18,
  statBg: '#F5FFED',
  padding: 16,
};

// Extracted Auth Message properties completely dependent on the configurations above
export const authPrompt = {
  bg: card.bg,
  border: card.border,
  borderWidth: card.borderWidth,
  radius: card.radius,
  padding: spacing.xl,        // Evaluates to 20px
  gap: spacing.xs,            // Evaluates to 4px (Used for inner card elements layout)
  buttonBg: colors.primaryDark,
  buttonRadius: radius.md,    // Evaluates to 10px
  buttonPaddingV: spacing.lg, // Evaluates to 12px internally
  buttonPaddingH: spacing.xl, // Evaluates to 20px internally
};