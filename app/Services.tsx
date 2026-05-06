import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../constants/theme';

export default function ServicesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={styles.title}>Under Construction</Text>
      <Text style={styles.sub}>Services coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emoji: { fontSize: 48 },
  title: { fontSize: typography.fontSize.xl, fontWeight: '600', color: colors.foreground },
  sub: { fontSize: typography.fontSize.sm, color: colors.mutedForeground },
});



