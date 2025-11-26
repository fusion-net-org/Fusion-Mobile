import { Filter, Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useDebounce } from '@/hooks/Debounce';
import { getSprintByProjectId } from '@/src/services/sprintService';
import { GetTaskBySprintId } from '@/src/services/taskService';
import { getUserById } from '@/src/services/userService';

// DATEPICKER
import DatePickerSection from '../layouts/datepickersection';

export default function SprintSection({ projectId }: { projectId: string }) {
  const [sprints, setSprints] = useState<any[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<any | null>(null);

  const [tasks, setTasks] = useState<any[]>([]);
  const [assignees, setAssignees] = useState<Record<string, string[]>>({});

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // ---------------- FETCH SPRINTS ----------------
  useEffect(() => {
    loadSprintForProject();
  }, [projectId]);

  const loadSprintForProject = async () => {
    try {
      const sprintsData = await getSprintByProjectId(projectId);
      const items = Array.isArray(sprintsData.data.items) ? sprintsData.data.items : [];
      setSprints(items);
      if (items.length > 0) setSelectedSprint(items[0]);
    } catch (error) {
      console.error('Load sprints failed', error);
    }
  };

  // ---------------- FETCH TASKS ----------------
  useEffect(() => {
    if (selectedSprint) {
      setPage(1);
      loadTasks(1, true);
    }
  }, [selectedSprint, debouncedSearch, statusFilter, priorityFilter, dateFrom, dateTo]);

  const loadTasks = async (pageNumber: number, reset = false) => {
    if (!selectedSprint) return;

    try {
      const response = await GetTaskBySprintId(
        selectedSprint.id,
        debouncedSearch,
        statusFilter === 'All' ? '' : statusFilter,
        priorityFilter === 'All' ? '' : priorityFilter,
        dateFrom ? dateFrom.toISOString() : '',
        dateTo ? dateTo.toISOString() : '',
        pageNumber,
        4,
      );

      const newTasks = response.data.items || [];
      setTasks(reset ? newTasks : [...tasks, ...newTasks]);
      setTotalPage(Math.ceil(response.data.totalCount / 4));

      // fetch assignees
      newTasks.forEach((task: any) => loadAssignees(task.id, task.assigneeIds || []));
    } catch (error) {
      console.error('Load tasks failed', error);
    }
  };

  const loadAssignees = async (taskId: string, userIds: string[]) => {
    console.log(userIds, 'List User');
    const names: string[] = [];
    for (const uid of userIds) {
      try {
        const user = await getUserById(uid);
        names.push(user.data.fullName);
      } catch {
        names.push('Unknown');
      }
    }

    setAssignees((prev) => ({ ...prev, [taskId]: names }));
  };

  const loadMore = () => {
    if (page < totalPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTasks(nextPage);
    }
  };

  const resetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setDateFrom(null);
    setDateTo(null);
  };

  // màu priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-yellow-400 text-black';
      case 'Low':
        return 'bg-green-400 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  // màu status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-400 text-white';
      case 'Open':
        return 'bg-gray-400 text-white';
      case 'Review':
        return 'bg-purple-400 text-white';
      case 'Done':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Sprint selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-2 px-3 py-2"
      >
        {sprints.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSelectedSprint(s)}
            className={`rounded-xl border px-4 py-2 ${
              selectedSprint?.id === s.id
                ? 'border-indigo-600 bg-indigo-500'
                : 'border-gray-300 bg-white'
            }`}
          >
            <Text
              className={`font-semibold ${selectedSprint?.id === s.id ? 'text-white' : 'text-gray-700'}`}
            >
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search + Filter */}
      <View className="flex-row items-center gap-2 px-3 py-2">
        <View className="flex-1 flex-row items-center gap-2 rounded-xl border border-gray-200 bg-white p-3">
          <Search size={18} color="#6b7280" />
          <TextInput
            placeholder="Search tasks..."
            value={search}
            onChangeText={setSearch}
            className="flex-1"
          />
        </View>

        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          className="rounded-xl border border-gray-300 bg-white p-3"
        >
          <Filter size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {/* Task list */}
      <ScrollView className="px-3 py-2">
        {tasks
          .slice()
          .sort((a, b) => (a.orderInSprint ?? 0) - (b.orderInSprint ?? 0))
          .map((task) => (
            <View
              key={task.id}
              className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <Text className="text-base font-semibold text-gray-900">{task.title}</Text>

              <View className="mt-2 flex-row justify-between">
                <Text className={`rounded-full px-2 py-1 text-xs ${getStatusColor(task.status)}`}>
                  {task.status}
                </Text>
                <Text
                  className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </Text>
              </View>

              <Text className="mt-1 text-sm text-gray-600">
                Assignees:{' '}
                {(assignees[task.id]?.length ?? 0) > 0
                  ? assignees[task.id].join(', ')
                  : 'No assignee'}
              </Text>

              <Text className="mt-2 text-xs text-gray-500">
                Due: {task.dueDate ? new Date(task.dueDate).toDateString() : 'No deadline'}
              </Text>
            </View>
          ))}

        {page < totalPage && (
          <TouchableOpacity
            onPress={loadMore}
            className="mx-auto my-4 rounded-xl bg-gray-100 px-6 py-3"
          >
            <Text className="font-medium text-gray-700">Load more</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-2xl bg-white p-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} />
              </TouchableOpacity>
            </View>

            {/* STATUS */}
            <Text className="mb-1 font-medium">Status</Text>
            <View className="mb-3 flex-row flex-wrap gap-2">
              {['All', 'Todo', 'In Progress', 'Review', 'Done'].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setStatusFilter(v)}
                  className={`rounded-xl border px-4 py-2 ${statusFilter === v ? 'border-indigo-600 bg-indigo-500' : 'border-gray-300 bg-white'}`}
                >
                  <Text className={`${statusFilter === v ? 'text-white' : 'text-gray-700'}`}>
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* PRIORITY */}
            <Text className="mb-1 font-medium">Priority</Text>
            <View className="mb-3 flex-row flex-wrap gap-2">
              {['All', 'Low', 'Medium', 'High'].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setPriorityFilter(v)}
                  className={`rounded-xl border px-4 py-2 ${priorityFilter === v ? 'border-indigo-600' : 'border-gray-300'} ${
                    getPriorityColor(v).split(' ')[0]
                  }`}
                >
                  <Text
                    className={`${priorityFilter === v ? 'text-white' : getPriorityColor(v).split(' ')[1]}`}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* DATE PICKERS */}
            <TouchableOpacity
              onPress={() => setShowDateFromPicker(true)}
              className="mb-2 rounded-xl border border-gray-300 bg-white px-4 py-2"
            >
              <Text>{dateFrom ? dateFrom.toDateString() : 'Date From'}</Text>
            </TouchableOpacity>
            <DatePickerSection
              visible={showDateFromPicker}
              title="Date From"
              initialDate={dateFrom}
              onSelect={(d) => setDateFrom(d)}
              onClose={() => setShowDateFromPicker(false)}
            />

            <TouchableOpacity
              onPress={() => setShowDateToPicker(true)}
              className="mb-2 rounded-xl border border-gray-300 bg-white px-4 py-2"
            >
              <Text>{dateTo ? dateTo.toDateString() : 'Date To'}</Text>
            </TouchableOpacity>
            <DatePickerSection
              visible={showDateToPicker}
              title="Date To"
              initialDate={dateTo}
              onSelect={(d) => setDateTo(d)}
              onClose={() => setShowDateToPicker(false)}
            />

            {/* BUTTONS */}
            <View className="mt-4 flex-row justify-between">
              <TouchableOpacity onPress={resetFilters} className="rounded-xl bg-gray-200 px-4 py-2">
                <Text className="text-gray-700">Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                className="rounded-xl bg-indigo-500 px-4 py-2"
              >
                <Text className="font-semibold text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
