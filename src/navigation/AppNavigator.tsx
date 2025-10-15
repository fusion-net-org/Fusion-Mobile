import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function AppNavigator() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack initialRouteName="auth">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
