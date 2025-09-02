import { View, Text, TextInput, StyleSheet, Alert, Image, FlatList, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { UserProfile } from '../../components/constants/types';
import { saveUserProfile } from '../../storage/userStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import HAIR from '../../components/constants/avatar/hair';
import BODY from '../../components/constants/avatar/body';
import FACIAL_HAIR from '../../components/constants/avatar/facial_hair';
import FACE from '../../components/constants/avatar/face';
import CLOTHES from '../../components/constants/avatar/clothes';



type CreateUserScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateUser'>;

export default function CreateUserScreen() {
  const navigation = useNavigation<CreateUserScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [selectedBody, setSelectedBody] = useState(BODY[0].id);
  const [selectedHair, setSelectedHair] = useState(HAIR[0].id);
  const [selectedFacialHair, setSelectedFacialHair] = useState<string | null>(null);
  const [selectedFace, setSelectedFace] = useState(FACE[0].id);
  const [selectedClothes, setSelectedClothes] = useState(CLOTHES[0].id);
  const handleCreate = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }

    const newUser: UserProfile = {
      username: username.trim(),
      avatar: {
        body: selectedBody,
        hair: selectedHair,
        facialHair: selectedFacialHair,
        face: selectedFace,
        clothes: selectedClothes,
      },
      bio: '',
      experiencePoints: 0,
      level: 1,
      badges: [],
      totalBooksRead: 0,
      totalPagesRead: 0,
      readingStreak: 0,
      ownedBags: [],
      ownedNightStands: [],
      ownedShelves: [],
      favoriteGenres: [],
      preferredLanguages: [],
      ownedSkins: {
        bagSkins: [],
        nightStandSkins: [],
        shelfSkins: [],
      },
    };

    await saveUserProfile(newUser); // <-- FIXED: actually save the user
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Your Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Avatar Preview</Text>
        <View style={styles.avatarPreviewContainer}>
          <View style={styles.avatarPreviewShadow}>
            <View style={styles.avatarPreview}>
              <Image source={BODY.find(b => b.id === selectedBody)?.image} style={styles.avatarLayer} />
              <Image source={CLOTHES.find(c => c.id === selectedClothes)?.image} style={styles.avatarLayer} />
              <Image source={FACE.find(f => f.id === selectedFace)?.image} style={styles.avatarLayer} />
              <Image source={HAIR.find(h => h.id === selectedHair)?.image} style={styles.avatarLayer} />
              {selectedFacialHair && (
                <Image source={FACIAL_HAIR.find(fh => fh.id === selectedFacialHair)?.image} style={styles.avatarLayer} />
              )}
            </View>
          </View>
        </View>
        <SelectionPanel
          label="Body"
          data={BODY}
          selectedId={selectedBody}
          onSelect={setSelectedBody}
        />
        <SelectionPanel
          label="Hair"
          data={HAIR}
          selectedId={selectedHair}
          onSelect={setSelectedHair}
        />
        <SelectionPanel
          label="Facial Hair"
          data={FACIAL_HAIR}
          selectedId={selectedFacialHair}
          onSelect={id => setSelectedFacialHair(selectedFacialHair === id ? null : id)}
        />
        <SelectionPanel
          label="Face"
          data={FACE}
          selectedId={selectedFace}
          onSelect={setSelectedFace}
        />
        <SelectionPanel
          label="Clothes"
          data={CLOTHES}
          selectedId={selectedClothes}
          onSelect={setSelectedClothes}
        />
        <Pressable style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

}

type AvatarPart = {
  id: string;
  image: any;
};

type SelectionPanelProps = {
  label: string;
  data: AvatarPart[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function SelectionPanel({ label, data, selectedId, onSelect }: SelectionPanelProps) {
  return (
    <View style={styles.panelContainer}>
      <Text style={styles.panelLabel}>{label}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.panelList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item.id)}>
            <Image
              source={item.image}
              style={[styles.option, selectedId === item.id && styles.selected]}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f7f8fa',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    fontSize: 16,
    color: '#222',
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarPreviewShadow: {
    backgroundColor: '#fff',
    borderRadius: 80,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  avatarLayer: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  panelContainer: {
    marginBottom: 16,
  },
  panelLabel: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    color: '#555',
  },
  panelList: {
    paddingVertical: 2,
  },
  option: {
    width: 48,
    height: 48,
    marginHorizontal: 4,
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#007aff',
    backgroundColor: '#e6f0ff',
  },
  createButton: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 4,
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});