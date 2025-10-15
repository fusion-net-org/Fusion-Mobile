import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';

export const apiInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.FUSION_API_BASE_URL_REAL_DEVICE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'text/plain',
  },
});

// Request interceptor
apiInstance.interceptors.request.use(
  async (config) => {
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const refreshTokenValue = user?.refreshToken;

      if (!refreshTokenValue) {
        isRefreshing = false;
        await AsyncStorage.removeItem('user');
        router.replace('/auth/login');
        return Promise.reject(error);
      }

      // try {
      //   const data = await refreshToken(refreshTokenValue);
      //   const newAccessToken = data.accessToken;
      //   const newRefreshToken = data.refreshToken;

      //   // update storage
      //   user.token = newAccessToken;
      //   user.refreshToken = newRefreshToken;
      //   await AsyncStorage.setItem('user', JSON.stringify(user));

      //   axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      //   processQueue(null, newAccessToken);

      //   return axiosInstance(originalRequest);
      // } catch (err) {
      //   processQueue(err, null);
      //   await AsyncStorage.removeItem('user');
      //   router.replace('/auth/login');
      //   return Promise.reject(err);
      // } finally {
      //   isRefreshing = false;
      // }
    }

    return Promise.reject(error);
  },
);
