import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EditBookScreen() {
  return (
    <View style={styles.container}>
      <Text>Edit Book Screen</Text>
      {/* You can add your edit form here later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});