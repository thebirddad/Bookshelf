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
  const [status, setStatus] = useState<'Bag' | 'Nightstand' | 'Shelf'>('Bag');
  const [selectedSearchResult, setSelectedSearchResult] = useState<any | null>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Map the UI label to your BookStatus type
  const statusLabels: { label: string; value: BookStatus }[] = [
    { label: 'Bag', value: 'Bag' },
    { label: 'Nightstand', value: 'Nightstand' },
    { label: 'Shelf', value: 'Shelf' },
  ];

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
      if (!title.trim()) {
        alert('Please enter a title');
        return;
      }

      const now = new Date().toISOString();
  const mappedStatus = status;

      const newBook: Book = {
        id: uuid.v4().toString(),
        title: title.trim(),
        author: selectedSearchResult?.authors?.[0] || '',
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
      <View style={styles.card}>
        <Text style={styles.header}>Add a Book</Text>
        <Text style={styles.label}>Search for a Book</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => { setTitle(text); searchBooks(text); }}
          placeholder="Book Title"
          placeholderTextColor="#aaa"
        />
        {searching && <Text style={styles.searching}>Searching...</Text>}
        {searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsLabel}>Search Results:</Text>
            {searchResults.map(item => (
              <View key={item.id} style={styles.searchResultItem}>
                <Text
                  style={styles.searchResultTitle}
                  onPress={() => {
                    setTitle(item.volumeInfo.title || '');
                    setSelectedSearchResult(item.volumeInfo);
                    setSearchResults([]);
                  }}
                >
                  {item.volumeInfo.title}
                </Text>
                {item.volumeInfo.authors && (
                  <Text style={styles.searchResultAuthor}>by {item.volumeInfo.authors.join(', ')}</Text>
                )}
              </View>
            ))}
          </View>
        )}
        <Text style={styles.label}>Add to...</Text>
        <View style={styles.statusButtons}>
          {statusLabels.map(({ label, value }) => (
            <View
              key={value}
              style={[styles.statusButton, status === value && styles.statusButtonSelected]}
            >
              <Text
                style={[styles.statusButtonText, status === value && styles.statusButtonTextSelected]}
                onPress={() => setStatus(value)}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.saveButtonWrapper}>
          <Button title="Save Book" color="#007aff" onPress={handleSave} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    alignSelf: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
    color: '#222',
  },
  searching: {
    color: '#007aff',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  searchResultsContainer: {
    marginBottom: 12,
    backgroundColor: '#f0f6ff',
    borderRadius: 10,
    padding: 8,
  },
  searchResultsLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#007aff',
  },
  searchResultItem: {
    marginBottom: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchResultTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  searchResultAuthor: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  statusButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    minWidth: 0,
    minHeight: 48,
    maxWidth: 120,
    flexShrink: 1,
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  statusButtonSelected: {
    backgroundColor: '#e6f0ff',
    borderColor: '#007aff',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  // statusButtonIcon styles removed
  statusButtonText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 15,
    flexShrink: 1,
    textAlign: 'center',
    flexWrap: 'nowrap',
    maxWidth: 80,
  },
  statusButtonTextSelected: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  saveButtonWrapper: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
});
