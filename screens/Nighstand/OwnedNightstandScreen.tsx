import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { loadUserProfile, saveUserProfile } from '../../storage/userStorage';
import { UserProfile } from '../../components/constants/types';
import Nightstand from '../../components/items/Nightstand';
import NIGHTSTAND_SKINS from '../../components/constants/nightstandskins';
import { loadBooks } from '../../storage/bookStorage';

async function getGenreCounts() {
  const allBooks = await loadBooks();
  const shelfBooks = allBooks.filter(b => b.status === 'Shelf');
  const genreCounts: Record<string, number> = {};
  shelfBooks.forEach(book => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });
  return genreCounts;
}

export default function OwnedNightstandScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedSkinId, setSelectedSkinId] = useState<string>('skin1');
  const [highlightedSkinId, setHighlightedSkinId] = useState<string | null>(null);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadUserProfile().then(profile => {
      setUser(profile);
      if (profile?.selectedNightStandSkinId) {
        setSelectedSkinId(profile.selectedNightStandSkinId);
      }
    });
    getGenreCounts().then(setGenreCounts);
  }, []);

  const emptySkins = NIGHTSTAND_SKINS.filter(skin => skin.id.includes('1'));

  function isSkinUnlocked(skin: typeof NIGHTSTAND_SKINS[number]) {
    if (!skin.requirement) return true;
    return (genreCounts[skin.requirement.genre] || 0) >= skin.requirement.count;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nightstand Skins</Text>
      <FlatList
        data={emptySkins}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const unlocked = isSkinUnlocked(item);
          const isFavorite = item.id === selectedSkinId && unlocked;
          const selected = item.id === highlightedSkinId;
          return (
            <TouchableOpacity
              activeOpacity={unlocked ? 0.7 : 1}
              onPress={() => setHighlightedSkinId(item.id)}
              style={[
                styles.skinCard,
                selected && styles.selectedCard,
                !unlocked && styles.lockedCard,
              ]}
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
              {!unlocked && item.requirement && (
                <Text style={styles.lockedLabel}>
                  Unlock by reading {item.requirement.count} {item.requirement.genre} books
                </Text>
              )}
              {selected && unlocked && (
                <Text style={styles.selectedLabel}>Selected</Text>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text>No skins unlocked yet. Read more books to unlock!</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {highlightedSkinId && (() => {
        const skin = emptySkins.find(s => s.id === highlightedSkinId);
        const unlocked = skin ? isSkinUnlocked(skin) : false;
        return unlocked ? (
          <TouchableOpacity
            style={styles.favoriteButton}
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
        {emptySkins.filter(skin => isSkinUnlocked(skin)).length} / {emptySkins.length} unlocked
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  skinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f5f5dc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b8860b',
    minHeight: 100,
  },
  selectedCard: {
    borderColor: '#007aff',
    borderWidth: 2,
  },
  skinName: { fontSize: 16, color: '#222', marginLeft: 16, flex: 1 },
  progress: { marginTop: 16, textAlign: 'center', color: '#888' },
  lockedCard: {
    backgroundColor: '#eee',
    borderColor: '#ccc',
  },
  lockedText: {
    color: '#aaa',
  },
  lockedLabel: {
    marginLeft: 16,
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  selectedLabel: {
    marginLeft: 16,
    color: '#007aff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    marginTop: 16,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});