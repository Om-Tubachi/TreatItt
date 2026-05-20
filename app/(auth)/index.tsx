import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo from '../../components/assets/icons/Logo.svg';
import Wave from '../../components/assets/Waves/Wave.svg';
import UpwardWave from '../../components/assets/Waves/WaveLightUp.svg';
import { AppText } from '../../components/atoms/AppText';
import { Button } from '../../components/atoms/Button';
import { colors } from '../../constants/theme';

export default function OpeningScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <UpwardWave />
      <Logo />
      <Wave />

      <View style={styles.textBlock}>
        <AppText variant="heading">Explore the app</AppText>
        <AppText variant="subtitle" style={styles.subtitle}>
          Manage FRP waste efficiently with NexFRP
        </AppText>
      </View>

      <View style={styles.actions}>
        <Button label="Sign In" onPress={() => router.push('/(auth)/sign-in')} />
        <Button label="Create account" variant="outlined" onPress={() => router.push('/(auth)/signup')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:              1,
    alignItems:        'center',
    justifyContent:    'flex-end',
    paddingBottom:     60,
    paddingHorizontal: 5,
  },
  textBlock: {
    alignItems:   'center',
    gap:          8,
    marginBottom: 40,
  },
  subtitle: { width: 319 },
  actions: {
    gap:        14,
    alignItems: 'center',
  },
});