import { View, Text, FlatList, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import BookCard from '../../components/items/BookCard';
import { Book, BookStatus } from '../../components/constants/types';
import { loadBooks, saveBooks } from '../../storage/bookStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BookModal from '../../components/modals/BookModal';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editRating, setEditRating] = useState<number | undefined>(undefined);

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
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedBook(item);
                      setEditRating(item.rating);
                      setModalVisible(true);
                    }}
                  >
                    <BookCard
                      book={item}
                      isHidden={!!item.hidden}
                      onHide={() => hideBook(item)}
                      onUnhide={() => unhideBook(item)}
                      showHidden={showHidden}
                    />
                  </TouchableOpacity>
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
      <BookModal
        visible={modalVisible}
        book={selectedBook}
        editRating={editRating}
        editPagesRead={selectedBook?.pagesRead}
        setEditRating={setEditRating}
        setEditPagesRead={() => {}}
        onSaveProgress={async () => {
          if (selectedBook) {
            const updatedBook = { ...selectedBook, rating: editRating };
            const allBooks = await loadBooks();
            const updatedBooks = allBooks.map(b => b.id === updatedBook.id ? updatedBook : b);
            await saveBooks(updatedBooks);
            setBooks(updatedBooks.filter(b => b.status === 'Shelf'));
            setSelectedBook(updatedBook);
            setModalVisible(false);
          }
        }}
        onMoveToShelf={undefined}
        onMoveToNightstand={undefined}
        onMoveBackToBag={undefined}
        onClose={() => setModalVisible(false)}
        canEditRating={true}
        canEditPagesRead={false}
      />
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
});