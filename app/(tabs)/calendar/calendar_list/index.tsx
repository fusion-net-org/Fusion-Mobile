import CalendarDateRangeModal from '@/components/calendar-layout/calendar-daterange-modal';
import CalendarHeaderTabs from '@/components/calendar-layout/calendar-header-navbar';
import AlertHeader from '@/components/layouts/alert-header';
import { TaskFilterApi, TaskItem } from '@/interfaces/task';
import { ROUTES } from '@/routes/route';
import { GetProjectByProjectId } from '@/src/services/projectService';
import { GetPageTasksByUserId } from '@/src/services/taskService';
import { FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function TaskListScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateRangeVisible, setDateRangeVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const [filters, setFilters] = useState<TaskFilterApi>({
    pageNumber: 1,
    pageSize: 10,
    keyword: '',
    projectId: undefined,
    sprintId: undefined,
    priority: undefined,
    type: undefined,
  });

  const resetFilters = () => {
    setSearchText('');
    setSelectedRange({ from: null, to: null });
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      keyword: '',
      projectId: undefined,
      sprintId: undefined,
      priority: undefined,
      type: undefined,
    });
  };

  const fetchTasks = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await GetPageTasksByUserId(filters);
      const items = res?.items ?? [];

      const itemsWithWorkflow = await Promise.all(
        items.map(async (task) => {
          if (task.project?.id) {
            try {
              const projectRes = await GetProjectByProjectId(task.project.id);
              const workflowName = projectRes?.data?.workflowName;
              return {
                ...task,
                project: { ...task.project, workflowName },
              };
            } catch (err) {
              console.error('Failed to fetch project workflow', err);
              return task;
            }
          }
          return task;
        }),
      );

      if (isLoadMore) setTasks((prev) => [...prev, ...itemsWithWorkflow]);
      else setTasks(itemsWithWorkflow);

      setTotalCount(res?.totalCount ?? 0);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Failed to fetch tasks', position: 'top' });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleLoadMore = () => {
    if (tasks.length >= totalCount || loadingMore) return;
    setFilters((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  const applySearch = () => {
    setFilters((prev) => ({ ...prev, keyword: searchText, pageNumber: 1 }));
  };

  const applyDateRangeFilter = (from: Date, to: Date) => {
    setSelectedRange({ from, to });
    setFilters((prev) => ({
      ...prev,
      fromDate: dayjs(from).format('YYYY-MM-DD'),
      toDate: dayjs(to).format('YYYY-MM-DD'),
      pageNumber: 1,
    }));
    setDateRangeVisible(false);
  };

  const renderTask = ({ item }: { item: TaskItem }) => {
    const priorityColors: Record<string, { bg: string; text: string }> = {
      High: { bg: 'bg-red-100', text: 'text-red-600' },
      Medium: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      Low: { bg: 'bg-green-100', text: 'text-green-600' },
      Urgent: { bg: 'bg-purple-100', text: 'text-purple-600' },
    };

    const statusColors: Record<string, string> = {
      Done: 'text-green-600',
      'In Progress': 'text-blue-600',
      Pending: 'text-gray-500',
      Overdue: 'text-red-600',
    };

    const severityColorMap: Record<string, string> = {
      Critical: 'text-red-600',
      Major: 'text-orange-500',
      Minor: 'text-green-600',
      Default: 'text-gray-500',
    };

    const priority = priorityColors[item.priority] || { bg: 'bg-gray-100', text: 'text-gray-600' };
    const statusColor = statusColors[item.status] || 'text-gray-500';
    const severityColor = severityColorMap[item.severity] || severityColorMap.Default;

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: ROUTES.TASK.CALENDAR_TASK as any,
            params: { id: item.taskId, backRoute: ROUTES.HOME.CALENDAR },
          })
        }
        className="m-3 rounded-xl bg-white p-4 shadow-md"
      >
        <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>

        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row flex-wrap items-center">
            <User size={14} color="#4B5563" />
            <Text className="ml-1 text-sm text-gray-500">
              {Array.from(new Set(item.members?.map((m) => m.memberName))).join(', ') || 'N/A'}
            </Text>
          </View>
          <Text className={`text-sm font-semibold ${statusColor}`}>{item.status}</Text>
        </View>

        <View className="mt-2">
          <Text
            className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${priority.bg} ${priority.text}`}
          >
            {item.priority || 'N/A'}
          </Text>
        </View>

        {item.sprint && (
          <Text className="mt-1 text-xs text-gray-500">
            Sprint: {item.sprint.name} ({item.sprint.start?.slice(0, 10)} -{' '}
            {item.sprint.end?.slice(0, 10)})
          </Text>
        )}

        {item.project && (
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs text-gray-500">Project: {item.project.name}</Text>
            {item.project.workflowName && (
              <Text className="text-xs text-gray-500">Workflow: {item.project.workflowName}</Text>
            )}
          </View>
        )}

        {item.severity && (
          <Text className={`mt-1 text-xs font-semibold ${severityColor}`}>
            Severity: {item.severity}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AlertHeader />
      <View className="flex-1 bg-gray-50">
        <CalendarHeaderTabs />

        <View className="flex-row items-center space-x-2 bg-white p-3">
          {/* Search Input */}
          <View className="mr-2 flex-1 flex-1 flex-row items-center rounded-xl border border-gray-300 px-3 py-1">
            <FontAwesome5 name="search" size={16} color="#888" />
            <TextInput
              className="ml-2 flex-1 text-sm text-gray-700"
              placeholder="Search tasks..."
              placeholderTextColor="#999"
              style={{ paddingVertical: 6 }}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={applySearch}
            />
          </View>

          {/* Calendar Button */}
          <TouchableOpacity
            className="mr-2 items-center justify-center rounded-xl bg-blue-600 px-3 py-2"
            onPress={() => setDateRangeVisible(true)}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="calendar-alt" size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center justify-center rounded-xl bg-gray-300 px-3 py-2"
            onPress={resetFilters}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="redo" size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.taskId}
          renderItem={renderTask}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator className="my-4" size="small" color="#2563EB" /> : null
          }
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-400">
              {loading ? 'Loading tasks...' : 'No tasks available'}
            </Text>
          }
        />
        <CalendarDateRangeModal
          visible={dateRangeVisible}
          initialFrom={selectedRange?.from || undefined}
          initialTo={selectedRange?.to || undefined}
          onClose={() => setDateRangeVisible(false)}
          onApply={applyDateRangeFilter}
        />
      </View>
    </>
  );
}
