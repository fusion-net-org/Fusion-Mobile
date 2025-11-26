import TaskCard from '@/components/task-layout.tsx/TaskInfoSection';
import { TaskVm } from '@/interfaces/task';
import { ROUTES } from '@/routes/route';
import { fetchOrderAndSortTasks } from '@/src/utils/fetchOrderAndSortTasks';
import { useProjectBoard } from '@/src/utils/ProjectBoardContext';
import { router } from 'expo-router';
import { BarChart, Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
import { twMerge } from 'tailwind-merge';

type Id = string;
const cn = (...xs: (string | false | null | undefined)[]) => twMerge(xs.filter(Boolean).join(' '));

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SprintInfoSection() {
  const { sprints, tasks, changeStatus, moveToNextSprint, split, done } = useProjectBoard();

  const [activeSprintId, setActiveSprintId] = useState<Id>(sprints[0]?.id ?? '');
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (sprints[0]?.id) initial[sprints[0].id] = true;
    return initial;
  });
  const [keyword, setKeyword] = useState('');

  const activeSprint = useMemo(
    () => sprints.find((s) => s.id === activeSprintId) ?? null,
    [sprints, activeSprintId],
  );

  // Columns & filtering
  const columns = useMemo(() => {
    if (!activeSprint) return { order: [] as string[], byId: {} as Record<string, any[]> };

    const order = activeSprint.statusOrder;
    const byId: Record<string, any[]> = {};

    const match = (t: any) =>
      !keyword ||
      (t.title ?? '').toLowerCase().includes(keyword.toLowerCase()) ||
      (t.code ?? '').toLowerCase().includes(keyword.toLowerCase());

    for (const st of order) byId[st] = [];

    for (const t of tasks) {
      if (t.sprintId !== activeSprint.id) continue;
      if (!match(t)) continue;

      const st = t.workflowStatusId;
      if (!byId[st]) byId[st] = [];
      byId[st].push(t);
    }

    return { order, byId };
  }, [tasks, activeSprint, keyword]);

  // Summary
  const committedPoints = useMemo(() => {
    if (!activeSprint) return 0;
    return tasks
      .filter((t) => t.sprintId === activeSprint.id)
      .reduce((s, t) => s + (t.storyPoints || 0), 0);
  }, [tasks, activeSprint]);

  const completedPoints = useMemo(() => {
    if (!activeSprint) return 0;
    return tasks
      .filter((t) => t.sprintId === activeSprint.id && t.statusCategory === 'DONE')
      .reduce((s, t) => s + (t.storyPoints || 0), 0);
  }, [tasks, activeSprint]);

  const completionPct =
    committedPoints > 0 ? Math.round((completedPoints / committedPoints) * 100) : 0;

  // UI helpers
  function fmtDate(d?: string) {
    return d ? new Date(d).toLocaleDateString() : 'N/A';
  }

  // Sprint Tabs
  const SprintTabs = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3 px-3">
      {sprints.map((s) => {
        const selected = s.id === activeSprintId;
        return (
          <TouchableOpacity
            key={s.id}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setActiveSprintId(s.id);
              setExpandedSprints({ [s.id]: true });
            }}
            className={cn(
              'mr-2 h-14 w-28 items-center justify-center rounded-lg border p-2',
              selected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white',
            )}
          >
            <Text
              className={cn(
                'text-center text-sm font-semibold',
                selected ? 'text-white' : 'text-gray-700',
              )}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {s.name}
            </Text>
            <Text
              className="text-center text-xs text-gray-400"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {fmtDate(s.start)} - {fmtDate(s.end)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // Search
  const SearchBar = (
    <View className="mb-3 px-4">
      <View className="relative w-full">
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Search tasks..."
          className="h-12 w-full rounded-full border border-gray-300 bg-white pl-12 pr-4 text-sm"
        />
        <View className="absolute bottom-0 left-3 top-0 justify-center">
          <Search size={20} color="#94A3B8" />
        </View>
      </View>
    </View>
  );

  // Summary card
  const SummaryCard = (
    <View className="mx-4 mb-3 rounded-xl border border-gray-200 bg-white p-4">
      <Text className="text-lg font-semibold">{activeSprint?.name}</Text>
      <Text className="mb-2 text-xs text-gray-500">
        {fmtDate(activeSprint?.start)} - {fmtDate(activeSprint?.end)}
      </Text>
      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-xs text-gray-500">Committed</Text>
          <Text className="text-lg font-semibold">{committedPoints}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500">Done</Text>
          <Text className="text-lg font-semibold">{completedPoints}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500">Completion</Text>
          <Text className="text-lg font-semibold">{completionPct}%</Text>
        </View>
      </View>
    </View>
  );

  interface ChartPoint {
    timestamp: number;
    value: number;
  }

  const chartData = [
    { timestamp: 0, value: 0 },
    { timestamp: 1, value: committedPoints },
    { timestamp: 2, value: completedPoints },
  ];

  const { width } = useWindowDimensions();
  const paddingHorizontal = 16;
  const chartWidth = width - 32;
  const chartHeight = 180;
  const maxValue = Math.max(...chartData.map((d) => d.value));

  // Burn-up Chart
  const BurnUpChart = (
    <View className="mx-4 mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
      {/* Tên biểu đồ */}
      <Text className="mb-2 text-lg font-semibold">Burn-up Chart</Text>

      {committedPoints > 0 ? (
        <>
          <View className="h-[180px] w-full">
            <LineChart.Provider data={chartData}>
              <LineChart height={180}>
                <LineChart.Path color="#2E8BFF" />
                <LineChart.Gradient color="#2E8BFF" />
                {chartData.map((_, i) => (
                  <LineChart.Dot key={i} at={i} color="#2E8BFF" size={6} />
                ))}
                <LineChart.CursorCrosshair>
                  <LineChart.Tooltip />
                </LineChart.CursorCrosshair>
              </LineChart>

              <View className="absolute left-0 top-[-8] h-full w-full">
                {chartData.map((point, i) => {
                  const x = (i / (chartData.length - 1)) * chartWidth;
                  const y = chartHeight - (point.value / maxValue) * chartHeight;

                  return (
                    <Text
                      key={i}
                      className="absolute text-xs font-bold text-gray-800"
                      style={{
                        left: x - 6,
                        top: y - 18,
                      }}
                    >
                      {point.value}
                    </Text>
                  );
                })}
              </View>
            </LineChart.Provider>
          </View>
          <Text className="mt-2 text-xs text-gray-500">
            This chart shows the number of story points committed and completed over the sprint.
          </Text>
        </>
      ) : (
        <View className="flex-1 items-center justify-center py-10">
          <BarChart size={50} color="#3B82F6" />
          <Text className="mt-2 text-center text-lg italic text-gray-500">No Burn-up Data</Text>
        </View>
      )}
    </View>
  );

  // Board accordion
  function Board(sprintId: string) {
    const sprint = sprints.find((s) => s.id === sprintId);
    const isExpanded = expandedSprints[sprintId];

    // 1. Hooks phải gọi ngay, không nằm trong if
    const [sortedTasksById, setSortedTasksById] = useState<{ [stId: string]: TaskVm[] }>({});

    useEffect(() => {
      if (!sprint || !isExpanded) return;

      const fetchAndSort = async () => {
        const newById: { [stId: string]: TaskVm[] } = {};
        const order = sprint.statusOrder ?? Object.keys(sprint.columns ?? {});
        const byId = sprint.columns ?? {};

        for (const stId of order) {
          const tasks = byId[stId] || [];
          newById[stId] = await fetchOrderAndSortTasks(sprintId, tasks);
        }
        setSortedTasksById(newById);
      };

      fetchAndSort();
    }, [sprintId, sprint, isExpanded]);

    if (!sprint || !isExpanded) return null; // return component chỉ sau hook

    const order = sprint.statusOrder ?? Object.keys(sprint.columns ?? {});
    // render sử dụng sortedTasksById, fallback về byId cũ nếu chưa load xong
    const byIdToRender = Object.keys(sortedTasksById).length
      ? sortedTasksById
      : (sprint.columns ?? {});

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-4 px-4">
          {order.map((stId) => {
            const items = byIdToRender[stId] || [];
            const meta = sprint.statusMeta[stId];
            return (
              <View key={stId} className="w-72 rounded-2xl border bg-white p-3">
                <Text className="mb-2 text-sm font-semibold">{meta?.name ?? meta?.code}</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {items.map((t) => (
                    <TaskCard
                      key={t.id}
                      t={t}
                      onMarkDone={done}
                      onSplit={split}
                      onNext={(x: TaskVm) => changeStatus((global as any).__projectId, x, stId)}
                      onMoveNext={(x: TaskVm) =>
                        moveToNextSprint((global as any).__projectId, x, sprintId)
                      }
                      onOpenTask={(id: string) =>
                        router.push({
                          pathname: ROUTES.TASK.TASK_DETAIL as any,
                          params: { id: id, backRoute: ROUTES.PROJECT.DETAIL },
                        })
                      }
                    />
                  ))}
                </ScrollView>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
      {SearchBar}
      {SprintTabs}
      {SummaryCard}
      {sprints.map((s) => (
        <View key={s.id}>{Board(s.id)}</View>
      ))}
      {BurnUpChart}
    </ScrollView>
  );
}
