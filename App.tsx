import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router'; // nếu bạn đang dùng expo-router
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// ✅ Cấu hình cách hiển thị khi app đang mở (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  //@ts-ignore
  const notificationListener = useRef<any>();

  //@ts-ignore
  const responseListener = useRef<any>();

  useEffect(() => {
    // 🔹 Đăng ký quyền và lấy token FCM
    registerForPushNotificationsAsync();

    // 🔹 Khi app đang mở, nhận thông báo
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📩 Notification received while foreground:', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('📲 User interacted with notification:', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <Stack />
      {/* Debug hiển thị notification nhận được */}
      {notification && (
        <View className="absolute bottom-2 left-0 right-0 items-center">
          <Text className="rounded-lg bg-white px-3 py-2 text-gray-800 shadow-md">
            📬 {notification.request.content.title}
          </Text>
        </View>
      )}
    </Provider>
  );
}

// 🔧 Hàm xin quyền và lấy token (FCM thật)
async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.warn('⚠️ Must use physical device for notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('⚠️ Notification permissions not granted');
      return;
    }

    // @ts-ignore: Expo SDK 50 chưa có định nghĩa projectId
    const tokenData = await Notifications.getDevicePushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    const deviceToken = tokenData.data;
    console.log('✅ FCM Token:', deviceToken);
  } catch (error) {
    console.error('❌ Error registering push notifications:', error);
  }
}
