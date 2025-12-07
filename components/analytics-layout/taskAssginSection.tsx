import { TaskAssgin } from '@/interfaces/task';
import { safeDate } from '@/src/utils/formatLocalDate';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
interface AssignedToMeProps {
  assignToMe: TaskAssgin[];
  onTaskPress: (task: TaskAssgin) => void;
}

const TaskAssignedToMe = ({ assignToMe, onTaskPress }: AssignedToMeProps) => {
  const renderItem = ({ item }: { item: TaskAssgin }) => (
    <TouchableOpacity
      onPress={() => onTaskPress(item)}
      className="flex-row items-center border-b border-gray-200 bg-white p-3"
    >
      {/* Checkbox */}
      <View className="mr-3 flex h-6 w-6 items-center justify-center rounded border border-indigo-500">
        <FontAwesome5 name="check" size={14} color="#6366F1" />
      </View>

      {/* Task Info */}
      <View className="flex-1">
        <Text className="text-xs text-gray-400">{item.type}</Text>
        <Text className="text-sm font-semibold text-gray-900">{item.code}</Text>
        <Text className="text-sm text-gray-700">{item.title}</Text>
      </View>

      {/* Time */}
      <Text className="text-xs text-gray-400">
        {(() => {
          const date = safeDate(item.updateAt) || safeDate(item.createAt);

          if (!date) return 'N/A';

          return formatDistanceToNow(date, { addSuffix: true });
        })()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="m-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200 p-3">
        <Text className="text-base font-bold text-gray-900">Assigned to Me</Text>
      </View>

      {/* Empty State */}
      {assignToMe.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="mb-2 text-6xl">📭</Text>
          <Text className="font-semibold text-gray-700">No tasks assigned</Text>
          <Text className="text-sm text-gray-400">You&apos;re all caught up!</Text>
        </View>
      ) : (
        <>
          {/* List tasks */}
          <FlatList
            data={assignToMe}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </>
      )}
    </View>
  );
};

export default TaskAssignedToMe;
