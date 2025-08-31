import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import { Book, BookStatus } from '../types';
import { loadBooks, saveBooks } from '../storage/bookStorage';
import { loadUserProfile, saveUserProfile } from '../storage/userStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type NightstandScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Nightstand'>;

export default function NightstandScreen() {
  const navigation = useNavigation<NightstandScreenNavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const allBooks = await loadBooks();
      setBooks(allBooks.filter(b => b.status === 'Nightstand'));
    });
    return unsubscribe;
  }, [navigation]);

  const moveToShelf = async (book: Book) => {
    const updatedBook = { ...book, status: 'Shelf' as BookStatus, dateCompleted: new Date().toISOString() };
    const allBooks = await loadBooks();
    const updatedBooks = allBooks.map(b => (b.id === book.id ? updatedBook : b));
    await saveBooks(updatedBooks);
      // Update user XP and totalBooksRead
    const user = await loadUserProfile();
    if (user) {
      const updatedUser = {
        ...user,
        experiencePoints: user.experiencePoints + 10,
        totalBooksRead: user.totalBooksRead + 1,
    };
    await saveUserProfile(updatedUser);
  }
    setBooks(updatedBooks.filter(b => b.status === 'Nightstand'));
  };

  const moveBackToBag = async (book: Book) => {
    const updatedBook = { ...book,  status: 'Bag' as BookStatus, dateStarted: undefined };
    const allBooks = await loadBooks();
    const updatedBooks = allBooks.map(b => (b.id === book.id ? updatedBook : b));
    await saveBooks(updatedBooks);
    setBooks(updatedBooks.filter(b => b.status === 'Nightstand'));
  };

  return (
    <View style={styles.container}>
      <Button
  title="View Nightstand Skins"
  onPress={() => navigation.navigate('OwnedNightstand')}
/>
      {books.length === 0 ? (
        <Text style={styles.emptyMessage}>Your Nightstand is empty. Start reading!</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View>
              <BookCard book={item} />
              <Button title="Mark as Read (Move to Shelf)" onPress={() => moveToShelf(item)} />
              <Button title="Move Back to Bag" onPress={() => moveBackToBag(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  emptyMessage: { marginTop: 20, fontStyle: 'italic', color: 'gray' },
});
