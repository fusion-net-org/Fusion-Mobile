import { StatusPreview } from '@/interfaces/workflow';
import { ScrollView, Text, View } from 'react-native';

interface Props {
  data: {
    statuses?: StatusPreview[];
  };
}

// Default status colors nếu API không trả về color
const defaultColors: Record<string, string> = {
  'To Do': '#1976d2',
  Planned: '#FBBF24',
  InProgress: '#2563EB',
  OnHold: '#F87171',
  Completed: '#16A34A',
  Test: '#ff9800',
};

export default function WorkflowMini({ data }: Props) {
  const statuses = data.statuses || [];

  // Sắp xếp theo x (nếu muốn hiển thị từ trái sang phải)
  const sorted = [...statuses].sort((a, b) => a.x - b.x);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
      {sorted.map((s) => (
        <View
          key={s.id}
          className="flex-row items-center rounded px-2 py-1"
          style={{ backgroundColor: s.color || defaultColors[s.name] || '#E5E7EB' }}
        >
          <Text className="text-[10px] font-semibold text-white">{s.name}</Text>
        </View>
      ))}
      {statuses.length === 0 && (
        <View className="rounded bg-gray-200 px-2 py-1">
          <Text className="text-[10px] text-gray-600">No statuses</Text>
        </View>
      )}
    </ScrollView>
  );
}
