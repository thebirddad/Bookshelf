import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadUserProfile, saveUserProfile } from '../storage/userStorage';
import { UserProfile, genre as GenreType } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Picker } from '@react-native-picker/picker';
import { getLevelFromXP } from '../components/levels';

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

  useEffect(() => {
    loadUserProfile().then(profile => {
      if (!profile || !profile.username) {
        navigation.replace('CreateUser');
      } else {
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
      <Text style={styles.header}>{user.username}</Text>
      {user.avatarUrl && (
        <View style={styles.avatarContainer}>
          <Text>Avatar:</Text>
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.avatarUrl}>{user.avatarUrl}</Text>
        </View>
      )}
      {user.bio ? <Text style={styles.bio}>Bio: {user.bio}</Text> : null}
<Text>
  Level: {getLevelFromXP(user.experiencePoints)}
</Text>
      <Text>XP: {user.experiencePoints}</Text>
      <Text>Total Books Read: {user.totalBooksRead}</Text>
      <Text>Total Pages Read: {user.totalPagesRead}</Text>
      <Text>Reading Streak: {user.readingStreak} days</Text>

      <Text style={styles.sectionHeader}>Bags Owned:</Text>
      {user.ownedBags.length > 0 ? (
        user.ownedBags.map((bag, idx) => (
          <Text key={idx}>- {bag.name}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}

      <Text style={styles.sectionHeader}>NightStands Owned:</Text>
      {user.ownedNightStands.length > 0 ? (
        user.ownedNightStands.map((ns, idx) => (
          <Text key={idx}>- {ns.name}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}

      <Text style={styles.sectionHeader}>Shelves Owned:</Text>
      {user.ownedShelves.length > 0 ? (
        user.ownedShelves.map((shelf, idx) => (
          <Text key={idx}>- {shelf.name}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}

      <Text style={styles.sectionHeader}>Favorite Genres:</Text>
      {user.favoriteGenres.length > 0 ? (
        user.favoriteGenres.map((genre, idx) => (
          <Text key={idx}>- {genre}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}

      {/* Add Genre Picker */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Picker
          selectedValue={selectedGenre}
          style={{ flex: 1 }}
          onValueChange={(itemValue: GenreType) => setSelectedGenre(itemValue)}
        >
          {GENRES.map(genre => (
            <Picker.Item key={genre} label={genre} value={genre} />
          ))}
        </Picker>
        <Button title="Add" onPress={handleAddGenre} />
      </View>

      <Text style={styles.sectionHeader}>Preferred Languages:</Text>
      {user.preferredLanguages.length > 0 ? (
        user.preferredLanguages.map((lang, idx) => (
          <Text key={idx}>- {lang}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}

      <Text style={styles.sectionHeader}>Badges:</Text>
      {user.badges.length > 0 ? (
        user.badges.map((badge, idx) => (
          <Text key={idx}>- {badge}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
      )}

      <Text style={styles.sectionHeader}>Owned Skins:</Text>
      <Text>Bag Skins:</Text>
      {user.ownedSkins.bagSkins.length > 0 ? (
        user.ownedSkins.bagSkins.map((skin, idx) => (
          <Text key={idx}>- {skin.name}</Text>
        ))
      ) : (
        <Text style={styles.empty}>None</Text>
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
  avatarContainer: { marginBottom: 10, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginVertical: 5 },
  avatarUrl: { fontSize: 12, color: 'gray' },
  bio: { marginBottom: 10 },
  sectionHeader: { marginTop: 15, fontWeight: 'bold' },
  empty: { color: 'gray', fontStyle: 'italic' },
});