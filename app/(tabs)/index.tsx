import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, FlatList, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const [instruments, setInstruments] = useState<any[]>([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    try {
      const { data, error } = await supabase.from('instruments').select();
      if (error) {
        console.error('Supabase error:', error);
        return;
      }
      if (data) setInstruments(data);
    } catch (e: any) {
      console.error('Fetch exception:', e);
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Instruments</ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={styles.listContainer}>
        <FlatList
          data={instruments}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <ThemedText>{item.name}</ThemedText>
            </View>
          )}
          ListEmptyComponent={<ThemedText>No instruments found or loading...</ThemedText>}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    paddingTop: 8,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
