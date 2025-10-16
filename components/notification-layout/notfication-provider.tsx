import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  // Android channel
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

  // Lấy permission & token
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('🚨 Failed to get push token!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('📨 Expo Push Token:', token);
      setExpoPushToken(token);
    };

    registerForPushNotificationsAsync();
  }, []);

  // Expo foreground notifications
  useEffect(() => {
    const foregroundListener = Notifications.addNotificationReceivedListener((notification) => {
      const { data, title, body } = notification.request.content;
      const type = data?.type;

      if (type === 'SYSTEM') {
        // SYSTEM → show toast
        Toast.show({
          type: 'info',
          text1: title ?? 'Notification',
          text2: body ?? '',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      }
      // BUSINESS → không xử lý ở foreground (schedule khi nhận FCM)
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('📲 User clicked notification:', data);
      // navigate nếu muốn
    });

    return () => {
      foregroundListener.remove();
      responseListener.remove();
    };
  }, []);

  // Firebase foreground messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { notification, data } = remoteMessage;
      if (!notification) return;

      const type = data?.type;
      const title = notification.title ?? 'Notification';
      const body = notification.body ?? '';

      if (type === 'SYSTEM') {
        // SYSTEM → show toast
        Toast.show({
          type: 'info',
          text1: title,
          text2: body,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      }

      if (type === 'BUSINESS') {
        // BUSINESS → hiển thị banner notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
          },
          trigger: null,
        });
      }
    });

    return unsubscribe;
  }, []);

  return <>{children}</>;
};
