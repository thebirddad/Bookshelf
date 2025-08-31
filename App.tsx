// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddBookScreen from './screens/AddBookScreen';
import BagScreen from './screens/BagScreen';
import NightstandScreen from './screens/NightstandScreen';
import ShelfScreen from './screens/ShelfScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import EditBookScreen from './screens/EditBookScreen';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import OwnedNightstandScreen from './screens/OwnedNightstandScreen';

export type RootStackParamList = {
  Home: undefined;
  AddBook: undefined;
  Bag: undefined;
  Nightstand: undefined;
  Shelf: undefined;
  UserProfile: undefined;
  CreateUser: undefined;
  EditBook: { bookId: string };
  OwnedNightstand: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerBackVisible: false,
            headerRight: () => (
              <Ionicons
                name="home"
                size={28}
                style={{ marginRight: 16 }}
                onPress={() => navigation.navigate('Home')}
              />
            ),
          })}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'My Bookshelf' }}
          />
          <Stack.Screen
            name="AddBook"
            component={AddBookScreen}
            options={{ title: 'Add a New Book' }}
          />
          <Stack.Screen
            name="Bag"
            component={BagScreen}
            options={{ title: 'Books in Bag' }}
          />
          <Stack.Screen
            name="Nightstand"
            component={NightstandScreen}
            options={{ title: 'Books in Nightstand' }}
          />
          <Stack.Screen
            name="Shelf"
            component={ShelfScreen}
            options={{ title: 'Books in Shelf' }}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfileScreen}
            options={{ title: 'The user profile' }}
          />
          <Stack.Screen
            name="CreateUser"
            component={CreateUserScreen}
            options={{ title: 'Adding a user' }}
          />
          <Stack.Screen
            name="EditBook"
            component={EditBookScreen}
            options={{ title: 'Edit a book' }}
          />
          <Stack.Screen
  name="OwnedNightstand"
  component={OwnedNightstandScreen}
  options={{ title: 'Nightstand Skins' }}
/>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
