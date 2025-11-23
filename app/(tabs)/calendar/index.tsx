import CalendarHeaderNavbar from '@/components/calendar-layout/calendar-header-navbar';
import CalendarTaskFilterSection from '@/components/calendar-layout/calendar-task-filter-section';
import AlertHeader from '@/components/layouts/alert-header';
import { FilterItem } from '@/interfaces/base';
import { TaskFilterApi, TaskItem } from '@/interfaces/task';
import { ROUTES } from '@/routes/route';
import { GetProjectByUserId } from '@/src/services/projectService';
import { GetPageTasksByUserId } from '@/src/services/taskService';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Toast from 'react-native-toast-message';

dayjs.extend(isBetween);

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tasksForMonth, setTasksForMonth] = useState<TaskItem[]>([]);

  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const [priorities] = useState<FilterItem[]>([
    { id: 'High', name: 'High' },
    { id: 'Medium', name: 'Medium' },
    { id: 'Low', name: 'Low' },
    { id: 'Urgent', name: 'Urgent' },
  ]);

  const [types] = useState<FilterItem[]>([
    { id: 'Bug', name: 'Bug' },
    { id: 'Feature', name: 'Feature' },
    { id: 'Chore', name: 'Chore' },
  ]);

  //---------Filter----------//
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [sprints, setSprints] = useState<{ id: string; name: string }[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

  const [keyword, setKeyword] = useState('');

  const [filters, setFilters] = useState<TaskFilterApi>({
    pageNumber: 1,
    pageSize: 100,
    keyword: '',
  });
  //-------------------//

  //--- API---//
  const fetchTasks = async () => {
    try {
      const result = await GetPageTasksByUserId({ ...filters, pageNumber: 1, pageSize: 1000 });
      const items = result?.items ?? [];
      setTasks(items);
      console.log(items, 'taskCale');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'No Tasks Found',
        position: 'top',
      });
    }
  };

  const fetchProjectsAndSprints = async (projectId: string | null = null) => {
    try {
      const res = await GetProjectByUserId('', 1, 100);
      const listProjects = res.data.items.map((p: any) => ({ id: p.id, name: p.name }));
      setProjects(listProjects);

      if (projectId) {
        const project = res.data.items.find((p: any) => p.id === projectId);
        const listSprints = project?.sprints.map((s: any) => ({ id: s.id, name: s.name })) || [];
        setSprints(listSprints);
      }
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Failed to fetch projects', position: 'top' });
    }
  };
  //-------------------//

  //--- Handle Filter---//
  const updateFilter = (key: keyof TaskFilterApi, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSelectProject = async (projectId: string | null) => {
    if (!projectId) {
      setSelectedProjectId(null);
      setSelectedSprintId(null);
      setSprints([]);
      updateFilter('projectId', null);
      updateFilter('sprintId', null);
      return;
    }

    setSelectedProjectId(projectId);

    updateFilter('projectId', projectId);
    updateFilter('sprintId', null);

    await fetchProjectsAndSprints(projectId);
  };

  const onSelectSprint = (sprintId: string | null) => {
    setSelectedSprintId(sprintId);
    updateFilter('sprintId', sprintId);
  };

  const onSelectPriority = (id: string | null) => {
    setSelectedPriorityId(id);
    updateFilter('priority', id);
  };

  const onSelectType = (id: string | null) => {
    setSelectedTypeId(id);
    updateFilter('type', id);
  };

  const resetAllFilters = () => {
    setSelectedProjectId(null);
    setSelectedSprintId(null);
    setSelectedPriorityId(null);
    setSelectedTypeId(null);

    // Cập nhật filter API
    setFilters({
      pageNumber: 1,
      pageSize: 100,
      keyword: '',
    });

    // Reset sprint list
    setSprints([]);
  };
  //----------//

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    fetchProjectsAndSprints();
  }, []);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    const today = dayjs().startOf('day');

    tasks.forEach((t) => {
      if (!t.dueDate) return;

      const due = dayjs(t.dueDate).startOf('day');
      const dateStr = due.format('YYYY-MM-DD');

      let color = '#2563EB';

      if (due.isBefore(today, 'day')) color = '#DC2626';
      else if (due.isSame(today, 'day')) color = '#F59E0B';
      else if (due.diff(today, 'day') <= 1) color = '#FBBF24';

      if (marks[dateStr]) {
        const existingColor = marks[dateStr].dots[0].color;
        const priority = (c: string) =>
          c === '#DC2626' ? 4 : c === '#F59E0B' ? 3 : c === '#FBBF24' ? 2 : 1;
        if (priority(color) > priority(existingColor)) {
          marks[dateStr].dots[0].color = color;
        }
      } else {
        marks[dateStr] = { dots: [{ color }], marked: true };
      }
    });

    if (selectedDate) {
      const existingDots = marks[selectedDate]?.dots || [];
      marks[selectedDate] = {
        ...(marks[selectedDate] || { dots: [] }),
        selected: true,
        selectedColor: '#2563EB',
        dots: existingDots.length ? existingDots : [{ color: '#2563EB' }],
      };
    }

    return marks;
  }, [tasks, selectedDate]);

  const tasksForDay = selectedDate
    ? tasks.filter((t) => {
        if (!t.dueDate) return false;
        const sel = dayjs(selectedDate).startOf('day');
        const dueDay = dayjs(t.dueDate).startOf('day');
        return sel.isSame(dueDay, 'day');
      })
    : [];

  const renderTask = ({ item }: { item: TaskItem }) => {
    const today = dayjs().startOf('day');
    const start = item.createAt ? dayjs(item.createAt).startOf('day') : null;
    const end = item.dueDate ? dayjs(item.dueDate).startOf('day') : null;

    // Determine task status based on dueDate
    let status = 'Normal';
    let statusColor = 'green';

    if (end) {
      if (end.isBefore(today, 'day')) {
        status = 'Overdue';
        statusColor = 'red';
      } else if (end.isSame(today, 'day')) {
        status = 'Today';
        statusColor = 'orange';
      } else if (end.diff(today, 'day') <= 1) {
        status = 'Upcoming';
        statusColor = 'yellow';
      }
    }

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: ROUTES.TASK.CALENDAR_TASK as any, params: { id: item.taskId } })
        }
        className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <Text className="text-base font-semibold text-gray-900">{item.title}</Text>

        <View className="mt-1 flex-row items-center justify-between">
          <Text className="text-xs text-gray-500">{item.code}</Text>

          {/* Priority */}
          <Text
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              item.priority === 'High'
                ? 'bg-red-100 text-red-600'
                : item.priority === 'Medium'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-green-100 text-green-600'
            }`}
          >
            {item.priority}
          </Text>
        </View>

        {start && end && (
          <View className="mt-2 flex-row justify-between">
            <Text className="text-xs text-gray-500">Start: {start.format('DD/MM/YYYY')}</Text>
            <Text className="text-xs text-gray-500">Due: {end.format('DD/MM/YYYY')}</Text>
          </View>
        )}

        {/* Severity & Status */}
        <View className="mt-1 flex-row justify-between">
          {item.severity && (
            <Text
              className={`text-xs font-semibold ${
                item.severity === 'Critical'
                  ? 'text-red-600'
                  : item.severity === 'Major'
                    ? 'text-orange-500'
                    : 'text-green-600'
              }`}
            >
              Severity: {item.severity}
            </Text>
          )}
          <Text
            className={`text-xs font-semibold ${
              statusColor === 'red'
                ? 'text-red-600'
                : statusColor === 'orange'
                  ? 'text-orange-500'
                  : statusColor === 'yellow'
                    ? 'text-yellow-600'
                    : 'text-green-600'
            }`}
          >
            Status: {status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={selectedDate ? tasksForDay : tasksForMonth}
        keyExtractor={(item) => item.taskId}
        renderItem={renderTask}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
        ListHeaderComponent={
          <>
            <AlertHeader />
            <CalendarHeaderNavbar />

            {/* Filter */}
            <CalendarTaskFilterSection
              projects={projects}
              sprints={sprints}
              priorities={priorities}
              types={types}
              selectedProjectId={selectedProjectId}
              selectedSprintId={selectedSprintId}
              selectedPriorityId={selectedPriorityId}
              selectedTypeId={selectedTypeId}
              onSelectProject={onSelectProject}
              onSelectSprint={onSelectSprint}
              onSelectPriority={onSelectPriority}
              onSelectType={onSelectType}
              onResetAll={resetAllFilters} // <-- truyền vào đây
            />

            {/* CALENDAR */}
            <View className="mb-6 min-h-[325px] flex-1 rounded-2xl bg-white p-3 shadow-sm">
              <Calendar
                markingType="multi-dot"
                onDayPress={(day) =>
                  setSelectedDate((prev) => (prev === day.dateString ? null : day.dateString))
                }
                onMonthChange={(month) => {
                  const monthStart = dayjs(`${month.year}-${month.month}-01`).startOf('month');
                  const monthEnd = monthStart.endOf('month');

                  const tasksInMonth = tasks.filter((t) => {
                    if (!t.dueDate) return false;
                    const due = dayjs(t.dueDate);
                    return due.isBetween(monthStart, monthEnd, 'day', '[]');
                  });

                  setTasksForMonth(tasksInMonth);
                }}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: '#2563EB',
                  todayTextColor: '#2563EB',
                  arrowColor: '#2563EB',
                  textDayFontSize: 18,
                  textMonthFontSize: 22,
                  textMonthFontWeight: 'bold',
                }}
                style={{ flex: 1, borderRadius: 12, justifyContent: 'center' }}
              />
            </View>

            <Text className="mb-3 text-lg font-semibold text-gray-800">
              {selectedDate
                ? `Tasks on ${dayjs(selectedDate).format('DD/MM/YYYY')}`
                : 'Tasks for selected month'}
            </Text>
          </>
        }
      />
    </View>
  );
}
