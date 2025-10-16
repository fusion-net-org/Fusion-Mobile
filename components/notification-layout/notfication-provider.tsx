import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  // Cấu hình channel cho Android
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

  // Đăng ký permission và lấy token
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('🚨 Failed to get push token for push notification!');
          return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('📨 Expo Push Token:', token);
        setExpoPushToken(token);
      } else {
        console.log('Must use physical device for Push Notifications');
      }

      return token;
    };

    registerForPushNotificationsAsync();
  }, []);

  // Nhận notification khi app ở foreground
  useEffect(() => {
    const foregroundListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 Notification received in foreground:', notification);
      // Alert.alert(
      //   notification.request.content.title ?? 'Thông báo',
      //   notification.request.content.body ?? '',
      // );
      // Có thể show alert, cập nhật state, ...
    });

    // Khi click notification
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('📲 User clicked notification:', data);

      // Ví dụ điều hướng theo data:
      // if (data.screen) navigate(data.screen, data.params);
    });

    return () => {
      foregroundListener.remove();
      responseListener.remove();
    };
  }, []);

  // Firebase background & quit notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('📨 FCM foreground message:', remoteMessage);
      const { notification, data } = remoteMessage;
      if (notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
            data: data,
          },
          trigger: null,
        });
      }
    });

    return unsubscribe;
  }, []);

  return <>{children}</>;
};
