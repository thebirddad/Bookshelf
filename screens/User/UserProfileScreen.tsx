import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadUserProfile, saveUserProfile } from '../../storage/userStorage';
import { recalculateTotalPagesRead } from '../../storage/bookStorage';
import { UserProfile, genre as GenreType } from '../../components/constants/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Picker } from '@react-native-picker/picker';
import { getLevelFromXP } from '../../components/constants/levels';
import HAIR from '../../components/constants/avatar/hair';
import BODY from '../../components/constants/avatar/body';
import FACIAL_HAIR from '../../components/constants/avatar/facial_hair';
import FACE from '../../components/constants/avatar/face';
import CLOTHES from '../../components/constants/avatar/clothes';


type UserProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserProfile'>;

const GENRES: GenreType[] = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Historical Fiction', 'Non-Fiction',
  'Biography', 'Self-Help', 'Health & Wellness', 'Travel', "Children's", 'Young Adult', 'Classics', 'Graphic Novels',
  'Poetry', 'Religion & Spirituality', 'Science & Technology', 'Art & Photography', 'Cookbooks', 'Business & Economics',
  'Politics & Social Sciences', 'Education', 'Comics & Humor', 'Drama', 'Short Stories', 'Anthologies', 'Dystopian',
  'Adventure', 'Western', 'Memoir', 'True Crime', 'Philosophy', 'Psychology', 'Environment', 'Parenting',
  'Crafts & Hobbies', 'Sports & Recreation', 'Music', 'Film & Television', 'LGBTQ+', 'Cultural Studies', 'Mythology',
  'Folklore', 'Other'
];

export default function UserProfileScreen() {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<GenreType>('Fantasy');
  const [showGenreCard, setShowGenreCard] = useState(false);


  useEffect(() => {
    loadUserProfile().then(async profile => {
      if (!profile || !profile.username) {
        navigation.replace('CreateUser');
      } else {
        const totalPagesRead = await recalculateTotalPagesRead();
        profile.totalPagesRead = totalPagesRead;
        setUser(profile);
      }
      setLoading(false);
    });
  }, [navigation]);

  const handleAddGenre = async () => {
    if (!user) return;
    if (user.favoriteGenres.includes(selectedGenre)) {
      Alert.alert('Already Added', 'This genre is already in your favorites.');
      return;
    }
  
    const updatedUser = {
      ...user,
      favoriteGenres: [...user.favoriteGenres, selectedGenre],
    };
    setUser(updatedUser);
    await saveUserProfile(updatedUser);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPreviewShadow}>
          <View style={styles.avatarPreview}>
            <Image source={BODY.find(b => b.id === user.avatar!.body)?.image} style={styles.avatarLayer} />
            <Image source={CLOTHES.find(c => c.id === user.avatar!.clothes)?.image} style={styles.avatarLayer} />
            <Image source={FACE.find(f => f.id === user.avatar!.face)?.image} style={styles.avatarLayer} />
            <Image source={HAIR.find(h => h.id === user.avatar!.hair)?.image} style={styles.avatarLayer} />
            {user.avatar!.facialHair && (
              <Image source={FACIAL_HAIR.find(fh => fh.id === user.avatar!.facialHair)?.image} style={styles.avatarLayer} />
            )}
          </View>
        </View>
      </View>
      <Text style={styles.header}>{user.username}</Text>
      {user.bio ? <Text style={styles.bio}>Bio: {user.bio}</Text> : null}
      <Text>
        Level: {getLevelFromXP(user.experiencePoints)}
      </Text>
      <Text>XP: {user.experiencePoints}</Text>
      <Text>Total Books Read: {user.totalBooksRead}</Text>
      <Text>Total Pages Read: {user.totalPagesRead}</Text>
      <Text>Reading Streak: {user.readingStreak} days</Text>
      <Text style={styles.sectionHeader}>Favorite Genres:</Text>
      <View style={styles.genreChipContainer}>
        {user.favoriteGenres.length > 0 ? (
          user.favoriteGenres.map((genre, idx) => (
            <View key={idx} style={styles.genreChip}>
              <Text style={styles.genreChipText}>{genre}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>None</Text>
        )}
      </View>

      <View style={styles.toggleGenreCardWrapper}>
        <Button
          title={showGenreCard ? 'Hide Genre Selection' : 'Add Genres'}
          color="#007aff"
          onPress={() => setShowGenreCard(prev => !prev)}
        />
      </View>
      {showGenreCard && (
        <View style={styles.genreCard}>
          <Text style={styles.genreLabel}>Add a Genre</Text>
          <View style={styles.genrePickerRow}>
            <Picker
              selectedValue={selectedGenre}
              style={styles.genrePicker}
              onValueChange={(itemValue: GenreType) => setSelectedGenre(itemValue)}
              dropdownIconColor="#007aff"
            >
              {GENRES.map(genre => (
                <Picker.Item key={genre} label={genre} value={genre} />
              ))}
            </Picker>
            <View style={styles.addGenreButtonWrapper}>
              <Button title="Add" color="#007aff" onPress={handleAddGenre} />
            </View>
          </View>
        </View>
      )}
      <Text>NightStand Skins:</Text>
      {user.ownedSkins.nightStandSkins.length > 0 ? (
        user.ownedSkins.nightStandSkins.map((skin, idx) => (
          <Text key={idx}>- {skin.name}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}
      <Text>Shelf Skins:</Text>
      {user.ownedSkins.shelfSkins.length > 0 ? (
        user.ownedSkins.shelfSkins.map((skin, idx) => (
          <Text key={idx}>- {skin.name}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarContainer: { marginBottom: 18, alignItems: 'center' },
  avatarPreviewShadow: {
    backgroundColor: '#fff',
    borderRadius: 80,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  avatarLayer: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  bio: { marginBottom: 10 },
  sectionHeader: { marginTop: 15, fontWeight: 'bold' },
  empty: { color: 'gray', fontStyle: 'italic' },
  genreChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  genreChip: {
    backgroundColor: '#e6f0ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#007aff',
  },
  genreChipText: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 14,
  },
  genreCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 18,
    marginTop: 4,
  },
  genreLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    color: '#444',
  },
  genrePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  genrePicker: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    color: '#222',
    marginRight: 8,
  },
  addGenreButtonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleGenreCardWrapper: {
    marginBottom: 8,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
});