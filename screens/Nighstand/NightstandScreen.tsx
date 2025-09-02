import { View, TextInput, Modal, ScrollView, Text, FlatList, Button, StyleSheet, TouchableOpacity, Image } from 'react-native'; import { useEffect, useState } from 'react';
import BookCard from '../../components/items/BookCard';
import { Book, BookStatus } from '../../components/constants/types';
import { loadBooks, saveBooks } from '../../storage/bookStorage';
import { loadUserProfile, saveUserProfile } from '../../storage/userStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Nightstand from '../../components/items/Nightstand';
import NIGHTSTAND_SKINS from '../../components/constants/nightstandskins'; // adjust path as needed
import BookModal from '../../components/modals/BookModal';

type NightstandScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Nightstand'>;

export default function NightstandScreen() {
  const navigation = useNavigation<NightstandScreenNavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);
  const [favoriteSkin, setFavoriteSkin] = useState(NIGHTSTAND_SKINS[0]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editRating, setEditRating] = useState<number | undefined>(undefined);
  const [editPagesRead, setEditPagesRead] = useState<number | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const allBooks = await loadBooks();
      const nightstandBooks = allBooks.filter(b => b.status === 'Nightstand');
      setBooks(nightstandBooks); // update state for rendering

      const user = await loadUserProfile();
      if (user?.selectedNightStandSkinId) {
        const skin = NIGHTSTAND_SKINS.find(s => s.id === user.selectedNightStandSkinId);
        console.log("Found skin:", skin);

        const prefixA = skin?.id.split('-')[0];
        let dynamicSkin = skin;
        let suffix = '1';
        if (nightstandBooks.length === 0) {
          console.log("nada");
          suffix = '1';
        } else if (nightstandBooks.length === 1) {
          console.log("1");
          suffix = '2';
        } else if (nightstandBooks.length > 1 && nightstandBooks.length < 4) {
          console.log("2-3");
          suffix = '3';
        } else if (nightstandBooks.length >= 4) {
          console.log("4+");
          suffix = '4';
        }
        const skinId = `${prefixA}-${suffix}`;
        console.log("Book:", nightstandBooks);
        console.log("Looking for:", skinId);
        dynamicSkin = NIGHTSTAND_SKINS.find(s => s.id === skinId) || NIGHTSTAND_SKINS[0];
        setFavoriteSkin(dynamicSkin);
      } else {
        setFavoriteSkin(NIGHTSTAND_SKINS[0]);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const moveToShelf = async (book: Book) => {
    const updatedBook = { ...book, status: 'Shelf' as BookStatus, dateCompleted: new Date().toISOString() };
    const allBooks = await loadBooks();
    const updatedBooks = allBooks.map(b => (b.id === book.id ? updatedBook : b));
    await saveBooks(updatedBooks);
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
    const updatedBook = { ...book, status: 'Bag' as BookStatus, dateStarted: undefined };
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
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Your Favorite Nightstand</Text>
      <View style={styles.nightstandStackContainer}>
        <Nightstand
          name={favoriteSkin.name}
          image={favoriteSkin.image}
          isFavorite={true}
          large={true}
        />
      </View>
      {/* Horizontal scroll for BookCards */}
      <View style={styles.scrollContainer}>
        <FlatList
          data={books}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ marginRight: 12 }}>
              <TouchableOpacity onPress={() => {
                console.log('Pressed book:', item);
                setSelectedBook(item);
                setEditRating(item.rating);
                setEditPagesRead(item.pagesRead);
                setModalVisible(true);
              }}>
                <BookCard book={item} />
              </TouchableOpacity>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookRow}
        />
      </View>
      <BookModal
        visible={modalVisible}
        book={selectedBook}
        editRating={editRating}
        editPagesRead={editPagesRead}
        setEditRating={setEditRating}
        setEditPagesRead={setEditPagesRead}
        onSaveProgress={async () => {
          if (selectedBook) {
            const updatedBook = {
              ...selectedBook,
              rating: editRating,
              pagesRead: editPagesRead,
            };
            const allBooks = await loadBooks();
            const updatedBooks = allBooks.map(b => b.id === updatedBook.id ? updatedBook : b);
            await saveBooks(updatedBooks);
            setBooks(updatedBooks.filter(b => b.status === 'Nightstand'));
            setSelectedBook(updatedBook);

            // Update user's total pages read
            const user = await loadUserProfile();
            if (user) {
              const prevBook = allBooks.find(b => b.id === updatedBook.id);
              const prevPages = prevBook?.pagesRead || 0;
              const newPages = editPagesRead || 0;
              const diff = newPages - prevPages;
              const updatedUser = {
                ...user,
                totalPagesRead: user.totalPagesRead + diff,
              };
              await saveUserProfile(updatedUser);
            }
          }
        }}
        onMoveToShelf={() => {
          if (selectedBook) {
            moveToShelf(selectedBook);
            setModalVisible(false);
            setSelectedBook(null);
          }
        }}
        onMoveBackToBag={() => {
          if (selectedBook) {
            moveBackToBag(selectedBook);
            setModalVisible(false);
            setSelectedBook(null);
          }
        }}
        onClose={() => setModalVisible(false)}
      />
      {books.length === 0 && (
        <Text style={styles.emptyMessage}>Your Nightstand is empty. Start reading!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  emptyMessage: { marginTop: 20, fontStyle: 'italic', color: 'gray' },
  nightstandStackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    height: 240,
    width: 300,
  },
  scrollContainer: {
    marginBottom: 16,
    minHeight: 140,
  },
  bookRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: 300,
  },
  bookCover: {
    width: 120,
    height: 180,
    marginBottom: 16,
  },
});