import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';

const BOOKS_KEY = 'BOOKS';

export async function loadBooks(): Promise<Book[]> {
  const data = await AsyncStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveBooks(books: Book[]): Promise<void> {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}