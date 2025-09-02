import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../components/constants/types';

const BOOKS_KEY = 'BOOKS';

export async function loadBooks(): Promise<Book[]> {
  const data = await AsyncStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveBooks(books: Book[]): Promise<void> {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export async function recalculateTotalPagesRead() {
  const allBooks = await loadBooks();
  // Sum totalPages for books on the shelf (completed)
  const shelfPages = allBooks
    .filter(b => b.status === 'Shelf')
    .reduce((sum, b) => sum + (b.totalPages || 0), 0);

  // Sum pagesRead for books on the nightstand (active)
  const nightstandPages = allBooks
    .filter(b => b.status === 'Nightstand')
    .reduce((sum, b) => sum + (b.pagesRead || 0), 0);

  return shelfPages + nightstandPages;
}

export async function removeBooks() {
  await AsyncStorage.removeItem(BOOKS_KEY);
}