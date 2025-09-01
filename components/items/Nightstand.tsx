import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type NightstandProps = {
  name: string;
  image: any;
  isFavorite?: boolean;
  large?: boolean;
  locked?: boolean;
  selected?: boolean;
};

export default function Nightstand({ image, isFavorite, large, locked, selected }: NightstandProps) {
  return (
    <View style={[
      large ? styles.largeContainer : styles.container,
      selected && styles.selected,
      locked && styles.locked,
    ]}>
      <View style={large ? styles.largeImageContainer : styles.imageContainer}>
        <Image
          source={image}
          style={[
            large ? styles.largeImage : styles.image,
            locked && styles.lockedImage
          ]}
          resizeMode="contain"
        />
        {isFavorite && (
          <MaterialIcons
            name="star"
            size={large ? 40 : 20}
            color="#FFD700"
            style={styles.starIcon}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
    margin: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#b8860b',
  },
  largeContainer: {
    alignItems: 'center',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    width: 300,
    height: 220,
    justifyContent: 'flex-end',
    borderWidth: 0,
  },
  selected: {
    borderColor: '#007aff',
    borderWidth: 2,
  },
  locked: {
    backgroundColor: '#eee',
    borderColor: '#ccc',
  },
  imageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
    overflow: 'hidden',
  },
  largeImageContainer: {
    width: 300,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 0,
    overflow: 'visible',
  },
  image: {
    width: 60,
    height: 60,
    opacity: 1,
  },
  largeImage: {
    width: 300,
    height: 220,
    opacity: 1,
  },
  lockedImage: {
    opacity: 0.3,
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
});