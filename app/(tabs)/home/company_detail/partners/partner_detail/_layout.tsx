import { Stack } from 'expo-router';

export default function PartnerDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="overview/index" options={{ headerShown: false }} />
      <Stack.Screen name="activity/index" options={{ headerShown: false }} />
      <Stack.Screen name="project_request/index" options={{ headerShown: false }} />
    </Stack>
  );
}
