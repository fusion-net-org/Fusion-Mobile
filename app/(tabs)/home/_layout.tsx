import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* chỉ tab chính */}
      <Stack.Screen name="notification" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
