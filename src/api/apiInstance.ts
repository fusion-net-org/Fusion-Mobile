import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { store } from '../redux/store';
import { refreshToken } from '../services/authService';

export const apiInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.FUSION_API_BASE_URL_REAL_DEVICE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

console.log(Constants.expoConfig?.extra?.FUSION_API_BASE_URL_REAL_DEVICE);

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
      config.headers['Content-Type'] = 'multipart/form-data';
      config.transformRequest = [(data) => data];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

type QueueItem = {
  resolve: (value: string | null) => void;
  reject: (error: any) => void;
};

let failedQueue: QueueItem[] = [];
let isRefreshing = false;

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
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('RefreshToen');

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiInstance(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const token = await refreshToken(store.dispatch);
      console.log(token);
      processQueue(token ? null : error, token);
      isRefreshing = false;

      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiInstance(originalRequest);
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
