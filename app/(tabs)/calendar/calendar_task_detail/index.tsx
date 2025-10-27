import AlertHeader from '@/components/layouts/alert-header';
import { FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { mockTasks } from '../../../../constants/data/task';

const TaskDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const task = mockTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Task not found.</Text>
      </View>
    );
  }

  return (
    <>
      <AlertHeader />
      <View className="flex-1 bg-white p-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 rounded-full p-2">
            <FontAwesome5 name="arrow-left" size={18} color="#1E3A8A" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">Task Detail</Text>
        </View>

        <ScrollView>
          <Text className="mb-2 text-2xl font-bold text-gray-900">{task.title}</Text>
          <Text className="mb-4 text-gray-600">{task.description}</Text>

          <View className="space-y-2">
            <Info label="Priority" value={task.priority} color={task.priority} />
            <Info label="Status" value={task.status} />
            <Info label="Project" value={task.project} />
            <Info label="Assignee" value={task.assignee} />
            <Info label="Due Date" value={dayjs(task.dueDate).format('DD/MM/YYYY')} />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const Info = ({ label, value, color }: { label: string; value: string; color?: string }) => {
  const colorStyle =
    color === 'High'
      ? 'text-red-600'
      : color === 'Medium'
        ? 'text-yellow-600'
        : color === 'Low'
          ? 'text-green-600'
          : 'text-gray-800';

  return (
    <View className="flex-row justify-between border-b border-gray-100 py-3">
      <Text className="font-semibold text-gray-500">{label}</Text>
      <Text className={`font-medium ${colorStyle}`}>{value}</Text>
    </View>
  );
};

export default TaskDetailScreen;
