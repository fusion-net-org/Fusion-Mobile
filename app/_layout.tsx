import { NotificationProvider } from '@/components/notification-layout/notfication-provider';
import { queryClient } from '@/src/redux/queryClient';
import { store } from '@/src/redux/store';
import { QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

export default function RootLayout() {
  console.log('RootLayout mounted');

  //Config global: handle noti
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
