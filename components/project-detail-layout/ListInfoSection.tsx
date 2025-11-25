import { StatusCategory } from '@/interfaces/base';
import { SprintVm } from '@/interfaces/sprint';
import { MemberRef, TaskVm } from '@/interfaces/task';
import { ROUTES } from '@/routes/route';
import { useProjectBoard } from '@/src/utils/ProjectBoardContext';
import { router } from 'expo-router';
import { Check, Clock, MoveDown, MoveRight, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const brand = '#2E8BFF';
const cn = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(' ');

const SLA: { type: TaskVm['type']; priority: TaskVm['priority']; h: number }[] = [
  { type: 'Bug', priority: 'Urgent', h: 24 },
  { type: 'Bug', priority: 'High', h: 48 },
  { type: 'Bug', priority: 'Medium', h: 72 },
  { type: 'Feature', priority: 'Urgent', h: 72 },
  { type: 'Feature', priority: 'High', h: 120 },
  { type: 'Feature', priority: 'Medium', h: 168 },
  { type: 'Feature', priority: 'Low', h: 336 },
  { type: 'Chore', priority: 'Low', h: 336 },
];

const slaTarget = (t: TaskVm) =>
  SLA.find((x) => x.type === t.type && x.priority === t.priority)?.h ?? null;

const labelFromCode = (code: string) =>
  code === 'inprogress'
    ? 'In progress'
    : code === 'inreview'
      ? 'In review'
      : code === 'todo'
        ? 'To do'
        : code === 'done'
          ? 'Done'
          : code;

export default function ListInfoSection({
  tasks,
  onMarkDone,
  onNext,
  onSplit,
  onMoveNext,
}: {
  tasks: TaskVm[];
  onMarkDone?: (t: TaskVm) => void;
  onNext?: (t: TaskVm) => void;
  onSplit?: (t: TaskVm) => void;
  onMoveNext?: (t: TaskVm) => void;
}) {
  const [kw, setKw] = useState('');
  const [cats, setCats] = useState<StatusCategory[]>([]);
  const sprints: SprintVm[] = useProjectBoard().sprints;

  const filtered = useMemo(() => {
    const k = kw.trim().toLowerCase();
    let list = tasks.filter((t) => !k || `${t.code} ${t.title}`.toLowerCase().includes(k));
    if (cats.length) list = list.filter((t) => cats.includes(t.statusCategory));
    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return list;
  }, [tasks, kw, cats]);

  const members: MemberRef[] = useMemo(() => {
    const map = new Map<string, MemberRef>();
    for (const t of tasks) {
      (t.assignees ?? []).forEach((m) => {
        if (!map.has(m.id)) map.set(m.id, m);
      });
    }
    return Array.from(map.values());
  }, [tasks]);

  const CatBtn = ({ v, label }: { v: StatusCategory; label: string }) => {
    const active = cats.includes(v);
    return (
      <TouchableOpacity
        onPress={() => setCats((s) => (active ? s.filter((x) => x !== v) : [...s, v]))}
        className={cn(
          'rounded-full border px-4 py-2',
          active
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-gray-300 bg-white text-gray-700',
        )}
      >
        <Text className={cn(active ? 'font-semibold text-white' : 'font-medium text-gray-700')}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTask = ({ item: t }: { item: TaskVm }) => {
    const target = slaTarget(t);
    const remain =
      target == null
        ? null
        : Math.ceil(
            target - Math.max(0, (new Date().getTime() - new Date(t.openedAt).getTime()) / 36e5),
          );
    const ratio =
      Math.max(
        0,
        Math.min(
          1,
          t.estimateHours && t.estimateHours > 0
            ? 1 - (t.remainingHours ?? 0) / t.estimateHours
            : 0,
        ),
      ) || 0;
    const isDone = t.statusCategory === 'DONE';
    console.log('task:', t);

    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: ROUTES.TASK.TASK_DETAIL as any,
            params: { id: t.id, backRoute: ROUTES.PROJECT.DETAIL },
          })
        }
      >
        <View className={cn('mb-3 rounded-xl bg-white p-4 shadow', isDone && 'opacity-70')}>
          {/* Header */}
          <View className="flex-row justify-between">
            <Text className="pb-2 font-semibold text-gray-800">{t.title}</Text>
            <Text className="text-xs text-gray-500">Sprint {t.sprintId?.split('-')[1] ?? '—'}</Text>
          </View>

          {/* Title + tags */}
          <View className="mt-1 flex-row flex-wrap gap-2">
            <View
              className={cn(
                'rounded-full border px-3 py-1',
                t.priority === 'Urgent'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : t.priority === 'High'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-400 bg-gray-50 text-gray-700',
              )}
            >
              <Text className="text-[11px] font-semibold">{t.priority}</Text>
            </View>

            <View className="rounded-full border border-blue-400 bg-blue-50 px-3 py-1">
              <Text className="text-[11px] font-semibold">{t.type}</Text>
            </View>
          </View>

          {/* Assignees */}
          <View className="mt-3 flex-row items-center">
            {Array.from(new Map((t.assignees ?? []).map((m) => [m.id, m])).values())
              .slice(0, 3)
              .map((m, i) => (
                <View
                  key={`${m.id}-${i}`}
                  className={cn(
                    'h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-200',
                    i > 0 && '-ml-3',
                  )}
                >
                  {m.avatarUrl ? (
                    <Image
                      source={{ uri: m.avatarUrl }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-[10px] font-semibold text-gray-700">
                      {(
                        m.name
                          .split(' ')
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join('') || '?'
                      ).toUpperCase()}
                    </Text>
                  )}
                </View>
              ))}
            {Math.max(
              0,
              Array.from(new Map((t.assignees ?? []).map((m) => [m.id, m])).values()).length - 3,
            ) > 0 && (
              <View className="-ml-3 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300">
                <Text className="text-[10px] font-semibold text-gray-700">
                  +
                  {Math.max(
                    0,
                    Array.from(new Map((t.assignees ?? []).map((m) => [m.id, m])).values()).length -
                      3,
                  )}
                </Text>
              </View>
            )}
          </View>

          {/* Status */}
          <Text className="mt-2 text-sm font-medium capitalize">{labelFromCode(t.statusCode)}</Text>

          {/* Progress */}
          <View className="mt-2 h-3 w-full rounded-full bg-gray-100">
            <View
              className="h-3 rounded-full"
              style={{ width: `${Math.round(ratio * 100)}%`, backgroundColor: brand }}
            />
          </View>

          {/* SLA */}
          {target != null && !isDone && (
            <View
              className={cn(
                'mt-2 flex-row items-center gap-1 rounded-full border px-3 py-1',
                remain! < 0
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : remain! <= 12
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-gray-300 bg-gray-50 text-gray-600',
              )}
            >
              <Clock className="h-3 w-3" />
              <Text className="text-[11px]">
                {remain! < 0 ? `Overdue ${Math.abs(remain!)}h` : `SLA ${remain}h left`}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View className="mt-3 flex-row flex-wrap gap-2">
            {!isDone && (
              <TouchableOpacity
                onPress={() => onMarkDone?.(t)}
                className="flex-row items-center gap-1 rounded-lg border border-green-300 bg-green-50 px-3 py-1"
              >
                <Check className="h-3 w-3" />
                <Text className="text-xs font-medium text-green-700">Done</Text>
              </TouchableOpacity>
            )}
            {!isDone && (
              <TouchableOpacity
                onPress={() => onNext?.(t)}
                className="flex-row items-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1"
              >
                <MoveRight className="h-3 w-3" />
                <Text className="text-xs font-medium text-blue-700">Next</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onMoveNext?.(t)}
              className="flex-row items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1"
            >
              <MoveDown className="h-3 w-3" />
              <Text className="text-xs font-medium text-gray-700">Move next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Search */}
      <View className="relative mb-4">
        <View
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: [{ translateY: -10 }],
            zIndex: 10,
          }}
        >
          <Search size={20} color="#9CA3AF" />
        </View>
        <TextInput
          value={kw}
          onChangeText={setKw}
          placeholder="Search code/title..."
          placeholderTextColor="#9CA3AF"
          className="h-14 w-full rounded-full border border-gray-300 bg-white pl-12 pr-4 text-sm"
        />
      </View>

      {/* Category filters */}
      <View className="mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
        >
          <CatBtn v="TODO" label="To do" />
          <CatBtn v="IN_PROGRESS" label="In progress" />
          <CatBtn v="REVIEW" label="In review" />
          <CatBtn v="DONE" label="Done" />
        </ScrollView>
      </View>

      {/* Task list */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-base text-gray-500">No task found</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
