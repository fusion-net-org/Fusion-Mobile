import { CheckCircle, Clock, Eye } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export function TicketTaskItem({ task, onPress }: any) {
  const isBacklog = !task.sprintId;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(task.id)}
      className="rounded-xl border border-gray-100 bg-gray-50 p-3"
    >
      {/* Code + status icon */}
      <View className="flex-row items-center justify-between">
        <Text className="font-mono text-xs text-gray-500">{task.code ?? '—'}</Text>

        {task.statusCategory === 'DONE' ? (
          <CheckCircle size={14} color="#22c55e" />
        ) : (
          <Eye size={14} color="#3b82f6" />
        )}
      </View>

      {/* Title */}
      <Text className="mt-1 text-sm font-semibold text-gray-900" numberOfLines={2}>
        {task.title}
      </Text>

      {/* TAGS */}
      <View className="mt-2 flex-row flex-wrap gap-2">
        {/* Backlog / On sprint */}
        <View
          className={`self-start rounded-full px-2.5 py-0.5 ${
            isBacklog ? 'bg-slate-200' : 'bg-green-500'
          }`}
        >
          <Text
            className={`text-[11px] font-medium leading-none ${
              isBacklog ? 'text-slate-700' : 'text-white'
            }`}
          >
            {isBacklog ? 'Backlog' : 'On sprint'}
          </Text>
        </View>

        {task.type && (
          <View className="self-start rounded-full border border-gray-200 bg-white px-2.5 py-0.5">
            <Text className="text-[11px] leading-none text-gray-700">{task.type}</Text>
          </View>
        )}

        {task.priority && (
          <View className="self-start rounded-full border border-gray-200 bg-white px-2.5 py-0.5">
            <Text className="text-[11px] leading-none text-gray-700">{task.priority}</Text>
          </View>
        )}

        {task.statusName && (
          <View className="self-start rounded-full border border-gray-200 bg-white px-2.5 py-0.5">
            <Text className="text-[11px] leading-none text-gray-700">{task.statusName}</Text>
          </View>
        )}
      </View>

      {/* META: Est / Remain*/}
      {(task.estimateHours != null || task.remainingHours != null) && (
        <View className="mt-2 flex-row flex-wrap items-center gap-4">
          {task.estimateHours != null && (
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="#6b7280" />
              <Text className="text-xs text-gray-500">Est: {task.estimateHours}h</Text>
            </View>
          )}

          {task.remainingHours != null && (
            <Text className="text-xs text-gray-500">Remain: {task.remainingHours}h</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
