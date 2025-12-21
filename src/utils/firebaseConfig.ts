import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { browserLocalPersistence, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyAddlMr8lYzhO0IpeWFHrJWOSA1ne0VM7c',
  authDomain: 'fusion-f0915.firebaseapp.com',
  projectId: 'fusion-f0915',
  storageBucket: 'fusion-f0915.firebasestorage.app',
  messagingSenderId: '109449510030',
  appId: '1:109449510030:web:53b806762e212a44cc9ddf',
  measurementId: 'G-8GFJLWH709',
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const persistence =
  Platform.OS === 'web' ? browserLocalPersistence : getReactNativePersistence(AsyncStorage);

export const auth = initializeAuth(app, {
  persistence,
});

export const webClientId =
  '109449510030-0no07rem23qsum7soganoqfa7uhelc3s.apps.googleusercontent.com';
export const androidClientId =
  '109449510030-qlmnktmprvkq2toaj1378klciar290mu.apps.googleusercontent.com';
