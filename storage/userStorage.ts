import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

const USER_PROFILE_KEY = 'USER_PROFILE';

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
  return data ? JSON.parse(data) as UserProfile : null;
}

export async function clearUserProfile(): Promise<void> {
  await AsyncStorage.removeItem(USER_PROFILE_KEY);
}