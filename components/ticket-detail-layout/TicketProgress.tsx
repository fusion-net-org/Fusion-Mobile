import dayjs, { Dayjs } from 'dayjs';
import { Info } from 'lucide-react-native';
import { Text, View } from 'react-native';
import GradientProgressBar from './GradientProgressBar';

interface Props {
  hasProcess: boolean;
  progressPercent: number; // 0 - 100
  doneCount: number;
  totalNonBacklog: number;
  startedCount: number;
  activeCount: number;
  firstStartedAt?: Dayjs | null;
  lastDoneAt?: Dayjs | null;
}

export default function TicketProgress({
  hasProcess,
  progressPercent,
  doneCount,
  totalNonBacklog,
  startedCount,
  activeCount,
  firstStartedAt,
  lastDoneAt,
}: Props) {
  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
      {/* HEADER */}
      <View className="mb-2 flex-row items-center justify-between">
        {hasProcess && (
          <Text className="text-sm font-medium text-gray-600">
            {doneCount}/{totalNonBacklog} done
          </Text>
        )}
      </View>

      {/* PROGRESS BAR */}
      <GradientProgressBar percent={hasProcess ? progressPercent : 0} />

      {/* LABEL */}
      <Text className="mt-1 text-right text-xs text-gray-500">
        {hasProcess ? `${Math.round(progressPercent)}%` : 'No sprint execution yet'}
      </Text>

      {/* DETAIL */}
      {hasProcess ? (
        <View className="gap-1">
          <Text className="text-xs text-gray-600">
            <Text className="font-semibold">Started:</Text> {startedCount}/{totalNonBacklog}
          </Text>
          <Text className="text-xs text-gray-600">
            <Text className="font-semibold">In progress:</Text> {activeCount}
          </Text>
          <Text className="text-xs text-gray-600">
            <Text className="font-semibold">Done:</Text> {doneCount}
          </Text>

          {firstStartedAt && (
            <Text className="text-xs text-gray-500">
              First started: {dayjs(firstStartedAt).format('DD/MM/YYYY HH:mm')}
            </Text>
          )}

          {lastDoneAt && (
            <Text className="text-xs text-gray-500">
              Last done: {dayjs(lastDoneAt).format('DD/MM/YYYY HH:mm')}
            </Text>
          )}
        </View>
      ) : (
        <View className="mt-2 flex-row items-center gap-1">
          <Info size={14} color="#9ca3af" />
          <Text className="text-xs text-gray-500">Tasks are still in backlog or not created.</Text>
        </View>
      )}
    </View>
  );
}
