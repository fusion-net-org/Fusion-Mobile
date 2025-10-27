import AlertHeader from '@/components/layouts/alert-header';
import { mockTasks } from '@/constants/data/task';
import { ROUTES } from '@/routes/route';
import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import CalendarHeaderTabs from '../../../../components/calendar-layout/calendar-header-navbar';

export default function TaskList() {
  const router = useRouter();

  return (
    <>
      <AlertHeader />
      <View className="flex-1 bg-gray-50">
        <CalendarHeaderTabs />

        <FlatList
          data={mockTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: ROUTES.TASK.CALENDAR_TASK as any, params: { id: item.id } })
              }
              className="m-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
              <Text className="mt-1 text-sm text-gray-500">👤 {item.assignee}</Text>
              <Text className="text-sm text-gray-400">📌 {item.status}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}
