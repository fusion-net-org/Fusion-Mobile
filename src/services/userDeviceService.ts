import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { RegisterUserDeviceRequest } from '../../interfaces/auth';
import { apiInstance } from '../api/apiInstance';

export const registerDevice = async (deviceInfo: RegisterUserDeviceRequest): Promise<any> => {
  try {
    const response = await apiInstance.post('/Device/Register', deviceInfo);

    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Device registration failed');
    }
  } catch (error: any) {
    console.error('Device registration error:', error);

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Device registration failed';

    throw new Error(message);
  }
};

export const getDeviceInfo = async () => {
  try {
    if (!Device.isDevice) {
      throw new Error('⚠️ Must use physical device for notifications');
    }

    // 1️⃣ Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('⚠️ Notification permission not granted');
    }

    // 2️⃣ Get FCM token
    // @ts-ignore
    const tokenData = await Notifications.getDevicePushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
    const deviceToken = tokenData.data;
    console.log('✅ FCM Token:', deviceToken);

    // 3️⃣ Device info
    return {
      deviceToken,
      platform: Platform.OS.toUpperCase(), // ANDROID
      deviceName: Device.modelName || 'Expo Device',
    };
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    throw error;
  }
};
