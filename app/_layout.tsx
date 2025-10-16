import { NotificationProvider } from '@/components/notification-layout/notfication-provider';
import { store } from '@/src/redux/store';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

export default function RootLayout() {
  console.log('🧩 RootLayout mounted');

  // ⚙️ Cấu hình global: cách xử lý noti khi app đang mở
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return (
    <Provider store={store}>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </NotificationProvider>
    </Provider>
  );
}
