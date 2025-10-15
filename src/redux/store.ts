import { UserStore } from '@/interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import userDeviceReducer from './userDeviceSlice';
import userReducer, { loginUser } from './userSlice';

const loadUserState = async () => {
  try {
    await AsyncStorage.clear();
    const storedUser = await AsyncStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error loading user from AsyncStorage:', error);
    return null;
  }
};

const isExpired = (u?: UserStore | null) => {
  if (!u?.expired) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return u.expired <= nowSec;
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    userDevice: userDeviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hàm khởi tạo lại state khi app mở
export const initializeUserState = async () => {
  const userData = await loadUserState();
  console.log('🔹 initializeUserState -> userData:', userData);

  if (!userData) return null;

  if (isExpired(userData)) {
    console.log('⚠️ Token expired, clearing user');
    await AsyncStorage.removeItem('user');
    return null;
  }

  // userData đã decode sẵn → KHÔNG decode lại
  store.dispatch(loginUser(userData));
  return userData;
};
