import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.aboutBox}>
        <Text style={styles.aboutText}>about app</Text>
      </View>

      <View style={styles.actionsPanel}>
        <View style={styles.registerSection}>
          <Text style={styles.sectionLabel}>register as</Text>
          <View style={styles.registerRow}>
            <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/recycler/create')}>
              <Text style={styles.registerBtnText}>recycler</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/collector/create')}>
              <Text style={styles.registerBtnText}>collection point</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/waste/create')}>
          <Text style={styles.actionBtnText}>log wastes generated</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/requirement/create')}>
          <Text style={styles.actionBtnText}>log product requirements</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/product/create')}>
          <Text style={styles.actionBtnText}>log your products for everyone to see</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  aboutBox: { height: 200, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  aboutText: { fontSize: 16, color: '#999' },
  actionsPanel: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, gap: 12 },
  registerSection: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, gap: 8 },
  sectionLabel: { fontSize: 13, color: '#666' },
  registerRow: { flexDirection: 'row', alignItems: 'center' },
  registerBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  registerBtnText: { fontSize: 15 },
  divider: { width: 1, height: '100%', backgroundColor: '#ccc' },
  actionBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' },
  actionBtnText: { fontSize: 14 },
});