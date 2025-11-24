import { UserStore } from '@/interfaces/user';
import { ROUTES } from '@/routes/route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { LoginRequest, RegisterRequest } from '../../interfaces/auth';
import { apiInstance } from '../api/apiInstance';
import { AppDispatch } from '../redux/store';
import { loginUser } from '../redux/userSlice';
import { getJWTPayload } from '../utils/jwtHelper';

export const login = async (login: LoginRequest): Promise<any> => {
  try {
    console.log('baseURL =', apiInstance.defaults.baseURL);
    const response = await apiInstance.post('/Authen/login', login);
    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      return {
        error: true,
        message: response.data.message ?? 'Login failed',
      };
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Login Failure';

    return {
      error: true,
      message,
    };
  }
};

export const register = async (register: RegisterRequest): Promise<any> => {
  try {
    const response = await apiInstance.post('/Authen/register', register);
    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Register failed');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Register Failure';

    throw new Error(message);
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await apiInstance.post('/Authen/request-password-reset/mobile', { email });
    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Forget Password error');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Register Failure';

    throw new Error(message);
  }
};

export const refreshToken = async (dispatch: AppDispatch): Promise<string | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) return null;

    const user = JSON.parse(userStr);

    const response = await apiInstance.post('/RefreshToken/refresh', {
      refreshToken: user.refreshToken,
    });
    const data = response.data.data;

    const jwtPayload = getJWTPayload(data.accessToken);
    if (!jwtPayload) throw new Error('Invalid access token');

    const updatedUser: UserStore = {
      userId: jwtPayload.sub!,
      userName: jwtPayload.username || user.userName || 'Unknown',
      email: jwtPayload.email || user.email || '',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expired: jwtPayload.exp,
    };

    dispatch(loginUser(updatedUser));

    await AsyncStorage.setItem('user', JSON.stringify(data));

    console.log(data.accessToken, 'New Acesss');

    return data.accessToken;
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: 'Session expired',
      text2: 'Your login session has expired. Please login again.',
      position: 'top',
      visibilityTime: 2000,
    });

    await AsyncStorage.removeItem('user');
    router.replace(ROUTES.AUTH.LOGIN as any);
    return null;
  }
};
