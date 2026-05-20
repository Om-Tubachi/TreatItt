import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { colors, fontSize, typography } from '../../constants/theme';

type Variant = 'heading' | 'subtitle' | 'body' | 'label' | 'caption';

interface Props extends TextProps {
  variant?: Variant;
  style?: TextStyle;
  children: React.ReactNode;
}

export const AppText: React.FC<Props> = ({ variant = 'body', style, children, ...rest }) => (
  <Text style={[styles[variant], style]} {...rest}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  heading: {
    fontFamily:    typography.heading,
    fontSize:      fontSize.xxl,
    lineHeight:    32 * 1.3,
    letterSpacing: -0.32,
    color:         colors.heading,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize:   fontSize.md,
    lineHeight: 17 * 1.25,
    color:      colors.body,
    textAlign:  'center',
  },
  body: {
    fontFamily: typography.body,
    fontSize:   fontSize.sm,
    color:      colors.black,
  },
  label: {
    fontFamily: typography.bodyMed,
    fontSize:   fontSize.sm,
    color:      colors.black,
  },
  caption: {
    fontFamily: typography.body,
    fontSize:   fontSize.xs,
    color:      colors.body,
  },
});