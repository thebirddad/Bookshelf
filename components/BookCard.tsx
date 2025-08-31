import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types';

type BookCardProps = {
  book: Book;
  isHidden?: boolean;
  onHide?: () => void;
  onUnhide?: () => void;
  showHidden?: boolean;
};

export default function BookCard({ book, isHidden, onHide, onUnhide, showHidden }: BookCardProps) {
  return (
    <View style={styles.book}>
      <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
      {showHidden && isHidden && onUnhide ? (
        <TouchableOpacity onPress={onUnhide} style={styles.hideIcon}>
          <Text style={{ fontSize: 18 }}>🔓</Text>
        </TouchableOpacity>
      ) : !isHidden && onHide ? (
        <TouchableOpacity onPress={onHide} style={styles.hideIcon}>
          <Text style={{ fontSize: 18 }}>🔒</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  book: {
    width: 70,
    height: 120,
    backgroundColor: '#f5deb3',
    borderColor: '#b8860b',
    borderWidth: 2,
    borderRadius: 6,
    marginHorizontal: 8,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
    position: 'relative',
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  hideIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
});