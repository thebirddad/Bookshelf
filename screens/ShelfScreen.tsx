import { View, Text, FlatList, Button, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import { Book, BookStatus } from '../types';
import { loadBooks, saveBooks } from '../storage/bookStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ShelfScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Shelf'>;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function ShelfScreen() {
  const navigation = useNavigation<ShelfScreenNavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const allBooks = await loadBooks();
      setBooks(allBooks.filter(b => b.status === 'Shelf'));
    });
    return unsubscribe;
  }, [navigation]);

  const hideBook = async (book: Book) => {
    const updatedBook = { ...book, hidden: true };
    const allBooks = await loadBooks();
    const updatedBooks = allBooks.map(b => (b.id === book.id ? updatedBook : b));
    await saveBooks(updatedBooks);
    setBooks(updatedBooks.filter(b => b.status === 'Shelf'));
  };

  const unhideBook = async (book: Book) => {
    const updatedBook = { ...book, hidden: false };
    const allBooks = await loadBooks();
    const updatedBooks = allBooks.map(b => (b.id === book.id ? updatedBook : b));
    await saveBooks(updatedBooks);
    setBooks(updatedBooks.filter(b => b.status === 'Shelf'));
  };

  // Filter books based on showHidden
  const visibleBooks = showHidden
    ? books
    : books.filter(b => b.hidden !== true);

  const shelves = chunkArray(visibleBooks, 5);

  return (
    <View style={styles.container}>
      <Button
        title={showHidden ? 'Hide hidden books' : 'Show hidden books'}
        onPress={() => setShowHidden(v => !v)}
      />
      {visibleBooks.length === 0 ? (
        <Text style={styles.emptyMessage}>Your Shelf is empty. Finish some books first!</Text>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ justifyContent: 'flex-end', paddingBottom: 40 }}
        >
          {shelves.map((shelfBooks, idx) => (
            <View key={idx} style={styles.shelfContainer}>
              <FlatList
                data={shelfBooks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <BookCard
                    book={item}
                    isHidden={!!item.hidden}
                    onHide={() => hideBook(item)}
                    onUnhide={() => unhideBook(item)}
                    showHidden={showHidden}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.shelf}
              />
              <View style={styles.shelfWood} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  emptyMessage: { marginTop: 20, fontStyle: 'italic', color: 'gray' },
  shelfContainer: { flex: 1, justifyContent: 'flex-end' },
  shelf: { alignItems: 'flex-end', paddingBottom: 16 },
  shelfWood: {
    height: 12,
    backgroundColor: '#b8860b',
    borderRadius: 6,
    marginHorizontal: 4,
    marginTop: -10,
    marginBottom: 20,
  },
  // shelfStack is no longer needed
});