import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { UserProfile } from '../../components/constants/types';
import { saveUserProfile } from '../../storage/userStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type CreateUserScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateUser'>;

export default function CreateUserScreen() {
  const navigation = useNavigation<CreateUserScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleCreate = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }

    const newUser: UserProfile = {
      username: username.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      bio: '',
      experiencePoints: 0,
      level: 1,
      badges: [],
      totalBooksRead: 0,
      totalPagesRead: 0,
      readingStreak: 0,
      ownedBags: [],
      ownedNightStands: [],
      ownedShelves: [],
      favoriteGenres: [],
      preferredLanguages: [],
      ownedSkins: {
        bagSkins: [],
        nightStandSkins: [],
        shelfSkins: [],
      },
    };

    await saveUserProfile(newUser); // <-- FIXED: actually save the user
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create User</Text>
      <Text>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
      />
      <Text>Avatar URL (optional):</Text>
      <TextInput
        style={styles.input}
        value={avatarUrl}
        onChangeText={setAvatarUrl}
        placeholder="Enter avatar URL"
      />
      <Button title="Create" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});