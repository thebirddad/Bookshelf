import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import BookCard from '../../components/items/BookCard';
import { Book, BookStatus } from '../../components/constants/types';
import { loadBooks } from '../../storage/bookStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { removeBooks } from '../../storage/bookStorage';
import { removeUserProfile } from '../../storage/userStorage';
import { Alert } from 'react-native';
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', async () => {
    const loadedBooks = await loadBooks();
    setBooks(loadedBooks);
  });
  return unsubscribe;
}, [navigation]);

  const visibleBooks = books.filter(book => book.hidden !== true);

  // Helper to count books by status (only visible)
  const countBooksByStatus = (status: BookStatus) =>
    visibleBooks.filter(book => book.status === status).length;

  // Recent books preview (last 3)
  const recentBooks = [...books].slice(-3).reverse();

return (
    <View style={styles.container}>
      <Button
  title="Clear All Data"
  color="#d9534f"
  onPress={async () => {
    await removeBooks();
    await removeUserProfile();
    setBooks([]);
    Alert.alert('Data Cleared', 'All books and user data have been removed.');
  }}
/>
      <Text style={styles.header}>My Bookshelf</Text>
      <Button title="Profile" onPress={() => navigation.navigate('UserProfile')} />
      <Button title="Add Book" onPress={() => navigation.navigate('AddBook')} />

      {visibleBooks.length === 0 && (
        <Text style={styles.emptyMessage}>
          No books yet. Start by adding one to your Bag!
        </Text>
      )}

      <View style={styles.containerButtons}>
        <Button
          title={`Bag (${countBooksByStatus('Bag')})`}
          onPress={() => navigation.navigate('Bag')}
        />
        <Button
          title={`Nightstand (${countBooksByStatus('Nightstand')})`}
          onPress={() => navigation.navigate('Nightstand')}
        />
        <Button
          title={`Shelf (${countBooksByStatus('Shelf')})`}
          onPress={() => navigation.navigate('Shelf')}
        />
      </View>

      {visibleBooks.length > 0 && (
        <View style={styles.recentBooksContainer}>
          <Text style={styles.subHeader}>Recently Added</Text>
          <FlatList
            data={recentBooks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <BookCard book={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  emptyMessage: { marginTop: 20, fontStyle: 'italic', color: 'gray' },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  recentBooksContainer: { marginTop: 10 },
});
