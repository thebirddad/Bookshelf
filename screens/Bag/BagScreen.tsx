import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import BookCard from '../../components/items/BookCard';
import { Book, BookStatus } from '../../components/constants/types';
import { loadBooks, saveBooks } from '../../storage/bookStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type BagScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bag'>;

export default function BagScreen() {
  const navigation = useNavigation<BagScreenNavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const allBooks = await loadBooks();
      setBooks(allBooks.filter(b => b.status === 'Bag'));
    });
    return unsubscribe;
  }, [navigation]);

const moveToNightstand = async (book: Book) => {
  const updatedBook = { ...book, status: 'Nightstand' as BookStatus, dateStarted: new Date().toISOString() };
  const allBooks = await loadBooks();
  const updatedBooks = allBooks.map(b => (b.id === book.id ? updatedBook : b));
  await saveBooks(updatedBooks);
  setBooks(updatedBooks.filter(b => b.status === 'Bag')); // Show only Bag books after update
  Alert.alert('Moved', `"${book.title}" moved to Nightstand.`);
};

return (
  <View style={styles.container}>
    {books.length === 0 ? (
      <>
        <Text style={styles.emptyMessage}>Your Bag is empty. Add some books!</Text>
        <Button title="Add Book" onPress={() => navigation.navigate('AddBook')} />
      </>
    ) : (
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <BookCard book={item} />
            <Button title="Start Reading (Move to Nightstand)" onPress={() => moveToNightstand(item)} />
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
