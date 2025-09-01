import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Book, BookStatus } from '../../components/constants/types';
import { saveBooks, loadBooks } from '../../storage/bookStorage';
import { loadUserProfile, saveUserProfile } from '../../storage/userStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

type AddBookScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddBook'>;

export default function AddBookScreen() {
  const navigation = useNavigation<AddBookScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'Want to Read' | 'Reading' | 'Read'>('Want to Read');
  const [selectedSearchResult, setSelectedSearchResult] = useState<any | null>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

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

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (e) {
      setSearchResults([]);
    }
    setSearching(false);
  };

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
        coverImageUrl: selectedSearchResult?.imageLinks?.thumbnail,
        synopsis: selectedSearchResult?.description,
        publisher: selectedSearchResult?.publisher,
        releaseDate: selectedSearchResult?.publishedDate,
        genre: selectedSearchResult?.categories?.[0],
        language: selectedSearchResult?.language,
        totalPages: selectedSearchResult?.pageCount,
        isbn: selectedSearchResult?.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10')?.identifier,
        // Add more fields as needed
      };

      const currentBooks = await loadBooks();
      await saveBooks([...currentBooks, newBook]);
      // Increment XP and totalBooksRead if added directly to Shelf
      if (mappedStatus === 'Shelf') {
        const user = await loadUserProfile();
        if (user) {
          const pagesToAdd = newBook.totalPages || 0;
          const updatedUser = {
            ...user,
            experiencePoints: user.experiencePoints + 10,
            totalBooksRead: user.totalBooksRead + 1,
            totalPagesRead: user.totalPagesRead + pagesToAdd,
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
      <Button title="Test Toast" onPress={() => Toast.show({
        type: 'success',
        text1: "test",
      })} />

      <Text>Search:</Text>
      <TextInput style={styles.input} value={title} onChangeText={(text) => { setTitle(text); searchBooks(text); }} placeholder="Book Title" />

      {searching && <Text>Searching...</Text>}
      {searchResults.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text>Search Results:</Text>
          {searchResults.map(item => (
            <Text
              key={item.id}
              style={{ padding: 5 }}
              onPress={() => {
                setTitle(item.volumeInfo.title || '');
                setAuthor(item.volumeInfo.authors?.[0] || '');
                setSelectedSearchResult(item.volumeInfo);
                setSearchResults([]);
              }}
            >
              {item.volumeInfo.title} {item.volumeInfo.authors ? `by ${item.volumeInfo.authors.join(', ')}` : ''}
            </Text>
          ))}
        </View>
      )}

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
