import { Stack } from 'expo-router';

export default function ProfileStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="change_password" />
      <Stack.Screen name="notification_setting" />
    </Stack>
  );
}
