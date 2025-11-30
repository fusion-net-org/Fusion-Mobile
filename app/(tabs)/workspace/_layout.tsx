import { Stack } from 'expo-router';

export default function WorkspaceWorkspaceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="workspace_task_detail" />
    </Stack>
  );
}
