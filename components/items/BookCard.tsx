import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../constants/types';

type BookCardProps = {
  book: Book;
  isHidden?: boolean;
  onHide?: () => void;
  onUnhide?: () => void;
  showHidden?: boolean;
  onPress?: () => void;
};

export default function BookCard({ book, isHidden, onHide, onUnhide, showHidden, onPress }: BookCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.book}>
        <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
        <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
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
    </TouchableOpacity>
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
  bookCover: {
    width: 120,
    height: 180,
    marginBottom: 16,
  },
});