import React from 'react';
import { Modal, View, ScrollView, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
import { Book } from '../constants/types';

type BookModalProps = {
  visible: boolean;
  book: Book | null;
  editRating: number | undefined;
  editPagesRead: number | undefined;
  setEditRating: (rating: number | undefined) => void;
  setEditPagesRead: (pages: number | undefined) => void;
  onSaveProgress: () => void;
  onMoveToShelf?: () => void;
  onMoveBackToBag?: () => void;
  onMoveToNightstand?: () => void;
  onClose: () => void;
  canEditRating?: boolean;
  canEditPagesRead?: boolean;
};

export default function BookModal({
  visible,
  book,
  editRating,
  editPagesRead,
  setEditRating,
  setEditPagesRead,
  onSaveProgress,
  onMoveToShelf,
  onMoveBackToBag,
  onMoveToNightstand,
  onClose,
  canEditRating = true,
  canEditPagesRead = true,
}: BookModalProps) {
  if (!book) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>

            <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 8 }}>
              book.title
            </Text>
            <Text style={{ marginBottom: 8 }}>{book.author}</Text>
            <Text style={{ marginBottom: 8 }}>{book.synopsis}</Text>
            <Text style={{ marginBottom: 4 }}>Genre: {book.genre}</Text>
            <Text style={{ marginBottom: 4 }}>Publisher: {book.publisher}</Text>
            <Text style={{ marginBottom: 4 }}>Release Date: {book.releaseDate}</Text>
            <Text style={{ marginBottom: 4 }}>Language: {book.language}</Text>
            <Text style={{ marginBottom: 4 }}>Pages: {book.totalPages}</Text>
            <Text style={{ marginBottom: 4 }}>ISBN: {book.isbn}</Text>
            <Text style={{ marginBottom: 4 }}>Rating:</Text>
            {canEditRating ? (
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 6, marginBottom: 8, width: 80, textAlign: 'center' }}
                keyboardType="decimal-pad"
                value={editRating !== undefined ? String(editRating) : ''}
                onChangeText={text => setEditRating(text ? parseFloat(text) : undefined)}
                placeholder="1-5"
              />
            ) : (
              <Text style={{ marginBottom: 8 }}>{editRating ?? 'Not rated'}</Text>
            )}
            <Text style={{ marginBottom: 4 }}>Pages Read:</Text>
            {canEditPagesRead ? (
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 6, marginBottom: 8, width: 80, textAlign: 'center' }}
                keyboardType="numeric"
                value={editPagesRead !== undefined ? String(editPagesRead) : ''}
                onChangeText={text => setEditPagesRead(Number(text))}
                placeholder="Pages"
              />
            ) : (
              <Text style={{ marginBottom: 8 }}>{editPagesRead ?? 0}</Text>
            )}
            {canEditRating || canEditPagesRead ? (
              <Button title="Save Progress" onPress={onSaveProgress} />
            ) : null}
            {onMoveToShelf && (
              <Button title="Move to Shelf" onPress={onMoveToShelf} />
            )}
            {onMoveToNightstand && (
              <Button title="Move to Nightstand" onPress={onMoveToNightstand} />
            )}
            {onMoveBackToBag && (
              <Button title="Move Back to Bag" onPress={onMoveBackToBag} />
            )}
            <Button title="Close" onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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