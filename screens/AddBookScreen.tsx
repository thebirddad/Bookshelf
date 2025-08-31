import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Book, BookStatus } from '../types';
import { saveBooks, loadBooks } from '../storage/bookStorage';
import { loadUserProfile, saveUserProfile } from '../storage/userStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

type AddBookScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddBook'>;

export default function AddBookScreen() {
  const navigation = useNavigation<AddBookScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'Want to Read' | 'Reading' | 'Read'>('Want to Read');


  // Map the UI status to your BookStatus type
  const statusMap: Record<typeof status, BookStatus> = {
    'Want to Read': 'Bag',
    'Reading': 'Nightstand',
    'Read': 'Shelf',
  };

  const cheekyPhrases = [
  "You bookworm, you! 📚",
  "Way to go on adding that book!",
  "Another one for the shelf!",
  "Your library grows stronger!",
  "Keep stacking those reads!",
  "Book added! Time to get cozy.",
  "You’re on a roll!",
  "That’s the spirit, reader!",
  "Your bookshelf thanks you!",
  "Page turner in the making!",
];

const handleSave = async () => {
  try {
    if (!title.trim() || !author.trim()) {
      alert('Please enter both title and author');
      return;
    }

    const now = new Date().toISOString();
    const mappedStatus = statusMap[status];

    const newBook: Book = {
      id: uuid.v4().toString(),
      title: title.trim(),
      author: author.trim(),
      status: mappedStatus,
      dateAdded: now,
      dateStarted: mappedStatus === 'Nightstand' ? now : undefined,
      dateCompleted: mappedStatus === 'Shelf' ? now : undefined,
    };

    const currentBooks = await loadBooks();
    await saveBooks([...currentBooks, newBook]);
    // Increment XP and totalBooksRead if added directly to Shelf
    if (mappedStatus === 'Shelf') {
      const user = await loadUserProfile();
      if (user) {
        const updatedUser = {
          ...user,
          experiencePoints: user.experiencePoints + 10,
          totalBooksRead: user.totalBooksRead + 1,
        };
        await saveUserProfile(updatedUser);
      }
    }
 // Show a random cheeky toast
    const phrase = cheekyPhrases[Math.floor(Math.random() * cheekyPhrases.length)];
    Toast.show({
      text1: phrase,
      position: 'bottom'
    });
    navigation.navigate('Home');
  } catch (e) {
    console.error('Error saving book:', e);
    alert('Failed to save book: ' + e);
  }
};

  return (
    <View style={styles.container}>
      <Button title="Test Toast" onPress={() =>Toast.show({
  type: 'success',
  text1: "test",
})} />
      <Text>Title:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Book Title" />

      <Text>Author:</Text>
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Book Author" />

      <Text>Status:</Text>
      <View style={styles.statusButtons}>
        {(['Want to Read', 'Reading', 'Read'] as const).map((s) => (
          <Button key={s} title={s} onPress={() => setStatus(s)} color={status === s ? 'blue' : 'gray'} />
        ))}
      </View>

      <Button title="Save Book" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  statusButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
});
