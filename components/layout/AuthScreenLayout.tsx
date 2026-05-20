import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/theme';
import BackArrowIcon from '../assets/icons/BackIcon.svg';
import { AppText } from '../atoms/AppText';

interface AuthScreenLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthScreenLayout({ children, title }: AuthScreenLayoutProps) {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.outerContainer}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <BackArrowIcon />
      </TouchableOpacity>

      <AppText variant="heading" style={styles.title}>{title}</AppText>

      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 24,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    height: 24,
    width: 24,
  },
  title: { 
    alignSelf: 'flex-start' 
  },
});