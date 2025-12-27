// app/profile/_layout.tsx
import { FontAwesome5 } from '@expo/vector-icons';
import { router, Stack, useSegments } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ProfileStack() {
  const segments = useSegments();
  const current = segments[segments.length - 1];

  // Mapping title cho từng màn
  const titles: Record<string, string> = {
    index: 'Profile',
    setting: 'Settings',
    information: 'Information',
    change_password: 'Change Password',
  };

  const title = titles[current] || 'Profile';

  return (
    <View className="flex-1 bg-white">
      {/* Header cố định */}
      <View className="w-full flex-row items-center justify-between border-b border-gray-100 px-5 pb-3 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <FontAwesome5 name="arrow-left" size={18} color="#333" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">{title}</Text>

        <TouchableOpacity onPress={() => console.log('menu pressed')} className="p-2">
          <FontAwesome5 name="bars" size={18} color="#333" />
        </TouchableOpacity>
      </View>

      {/*Nội dung từng màn */}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
