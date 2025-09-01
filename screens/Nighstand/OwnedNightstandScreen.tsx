import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { loadUserProfile, saveUserProfile } from '../../storage/userStorage';
import { UserProfile } from '../../components/constants/types';
import Nightstand from '../../components/items/Nightstand';
import NIGHTSTAND_SKINS from '../../components/constants/nightstandskins'; // adjust path as needed

export default function OwnedNightstandScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedSkinId, setSelectedSkinId] = useState<string>('skin1'); // favorite
  const [highlightedSkinId, setHighlightedSkinId] = useState<string | null>(null); // selection

  useEffect(() => {
    loadUserProfile().then(profile => {
      setUser(profile);
      if (profile?.selectedNightStandSkinId) {
        setSelectedSkinId(profile.selectedNightStandSkinId);
      }
    });
  }, []);

const emptySkins = NIGHTSTAND_SKINS.filter(skin => skin.id.includes('1'));
  //const unlockedCount = user ? Math.min(user.level + 1, emptySkins.length) : 1; // Ensure at least 1 skin is unlocked
  const unlockedCount = emptySkins.length;
return (
  <View style={styles.container}>
    <Text style={styles.header}>Nightstand Skins</Text>
    <FlatList
      data={emptySkins}
      keyExtractor={item => item.id}
      key={'nightstand-skins-2columns'}
      renderItem={({ item, index }) => {
        const unlocked = index < unlockedCount;
        const isFavorite = item.id === selectedSkinId && unlocked;
        const selected = item.id === highlightedSkinId;
        return (
          <TouchableOpacity
            activeOpacity={unlocked ? 0.7 : 1}
            onPress={() => setHighlightedSkinId(item.id)}
          >
            <Nightstand
              name={item.name}
              image={item.image}
              locked={!unlocked}
              selected={selected}
              isFavorite={isFavorite}
            />
            <Text style={[styles.skinName, !unlocked && styles.lockedText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
      numColumns={2}
      ListEmptyComponent={<Text>No skins unlocked yet. Level up to unlock!</Text>}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
    {/* Favorite button */}
    {highlightedSkinId && (() => {
      const selectedSkin = NIGHTSTAND_SKINS.find(s => s.id === highlightedSkinId);
      const unlocked = selectedSkin && NIGHTSTAND_SKINS.indexOf(selectedSkin) < unlockedCount;
      return unlocked ? (
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: '#007aff',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={async () => {
            setSelectedSkinId(highlightedSkinId);
            if (user) {
              const updatedUser = { ...user, selectedNightStandSkinId: highlightedSkinId };
              await saveUserProfile(updatedUser);
              setUser(updatedUser);
            }
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Favorite</Text>
        </TouchableOpacity>
      ) : null;
    })()}
    <Text style={styles.progress}>
      {unlockedCount} / {emptySkins.length} unlocked
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
  selectedCard: {
    borderColor: '#007aff',
    borderWidth: 2,
  },
  skinName: { fontSize: 16, color: '#222' },
  progress: { marginTop: 16, textAlign: 'center', color: '#888' },
  lockedCard: {
    backgroundColor: '#eee',
    borderColor: '#ccc',
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
  selectedLabel: {
    marginTop: 4,
    color: '#007aff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});