import { CALENDAR_TABS } from '@/constants/navigate/tabs';
import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CalendarHeaderNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/');

  let currentTab = segments.includes('calendar_list') ? 'calendar_list' : 'calendar';

  return (
    <View className="flex-row border-b border-gray-200 bg-white">
      {CALENDAR_TABS.map((tab) => {
        const isActive = currentTab === tab.key;
        const targetPath =
          tab.key === 'calendar' ? '/(tabs)/calendar' : '/(tabs)/calendar/' + tab.key;
        console.log(targetPath);

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => router.replace(targetPath as any)}
            className="flex-1 items-center justify-center py-3"
            activeOpacity={0.7}
          >
            <Text
              className={`text-base font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}
            >
              {tab.title}
            </Text>
            {isActive && <View className="mt-1 h-[3px] w-10 rounded-full bg-blue-600" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
