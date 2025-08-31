import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { loadUserProfile } from '../storage/userStorage';
import { UserProfile } from '../types';

const NIGHTSTAND_SKINS = Array.from({ length: 10 }, (_, i) => ({
  id: `skin${i + 1}`,
  name: `Nightstand Skin ${i + 1}`,
  // image: require(`../assets/nightstand${i + 1}.png`), // Uncomment if you have images
}));

// Placeholder image (replace with your own asset if you have one)
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/60x60.png?text=🛏️';

export default function OwnedNightstandScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUserProfile().then(setUser);
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate how many skins are unlocked
  const unlockedCount = Math.min(Math.floor(user.level / 5), NIGHTSTAND_SKINS.length);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nightstand Skins</Text>
<FlatList
  data={NIGHTSTAND_SKINS}
  keyExtractor={item => item.id}
  key={'nightstand-skins-2columns'} // <-- Add this line
  renderItem={({ item, index }) => {
    const unlocked = index < unlockedCount;
    return (
      <View style={[styles.skinCard, !unlocked && styles.lockedCard]}>
        <Image
          source={{ uri: PLACEHOLDER_IMAGE }}
          style={[styles.skinImage, !unlocked && styles.lockedImage]}
          resizeMode="contain"
        />
        <Text style={[styles.skinName, !unlocked && styles.lockedText]}>
          {item.name}
        </Text>
        {!unlocked && <Text style={styles.lockedLabel}>Locked</Text>}
      </View>
    );
  }}
  numColumns={2}
  ListEmptyComponent={<Text>No skins unlocked yet. Level up to unlock!</Text>}
  contentContainerStyle={{ paddingBottom: 20 }}
/>
      <Text style={styles.progress}>
        {unlockedCount} / {NIGHTSTAND_SKINS.length} unlocked
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  skinCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    margin: 8,
    backgroundColor: '#f5f5dc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b8860b',
    minWidth: 140,
  },
  skinImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
    opacity: 1,
  },
  skinName: { fontSize: 16, color: '#222' },
  progress: { marginTop: 16, textAlign: 'center', color: '#888' },
  lockedCard: {
    backgroundColor: '#eee',
    borderColor: '#ccc',
  },
  lockedImage: {
    opacity: 0.3,
  },
  lockedText: {
    color: '#aaa',
  },
  lockedLabel: {
    marginTop: 4,
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
  },
});