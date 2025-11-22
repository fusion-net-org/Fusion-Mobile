import { useProjectBoard } from '@/src/utils/ProjectBoardContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import KanbanBySprintBoard from './KanbanBySprintBoard';
import ListInfoSection from './ListInfoSection';
import SprintInfoSection from './SprintInfoSection';

interface ProjectBoardInnerProps {
  projectId?: string;
}

export default function ProjectBoardInner({ projectId }: ProjectBoardInnerProps) {
  const { sprints, tasks, loading, changeStatus, moveToNextSprint, reorder, done, split } =
    useProjectBoard();
  const tabBarHeight = useBottomTabBarHeight();

  const [view, setView] = React.useState<'Kanban' | 'Sprint' | 'List'>('Kanban');
  const [query, setQuery] = React.useState('');
  const [kanbanFilter, setKanbanFilter] = React.useState<
    'ALL' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  >('ALL');

  const eventApi = {
    onMarkDone: async (t: any) => {
      const sp = sprints.find((s: any) => s.id === t.sprintId);
      if (!sp) return;
      const finalId =
        sp.statusOrder.find((id: string) => sp.statusMeta[id]?.isFinal) ??
        sp.statusOrder[sp.statusOrder.length - 1];
      if (t.workflowStatusId !== finalId) {
        return changeStatus((global as any).__projectId, t, finalId);
      }
      return done((global as any).__projectId, t);
    },
    onNext: async (t: any) => {
      const sp = sprints.find((s: any) => s.id === t.sprintId);
      if (!sp) return;
      const idx = sp.statusOrder.indexOf(t.workflowStatusId);
      const nextId = sp.statusOrder[Math.min(idx + 1, sp.statusOrder.length - 1)];
      if (nextId && nextId !== t.workflowStatusId)
        return changeStatus((global as any).__projectId, t, nextId);
    },
    onSplit: (t: any) => split((global as any).__projectId, t),
    onMoveNext: (t: any) => {
      const idx = sprints.findIndex((s: any) => s.id === (t.sprintId ?? ''));
      const next = sprints[idx + 1];
      if (next) return moveToNextSprint((global as any).__projectId, t, next.id);
    },
    onMoveToSprint: (t: any, toSprintId: string) =>
      moveToNextSprint((global as any).__projectId, t, toSprintId),
  };

  const listTasks = React.useMemo(() => {
    const k = query.trim().toLowerCase();
    if (!k) return tasks;
    return tasks.filter((t: any) => `${t.code} ${t.title}`.toLowerCase().includes(k));
  }, [tasks, query]);

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      {/* header */}
      <View className="flex-row gap-2 border-b border-gray-200 bg-[#F7F8FA] px-3 py-3">
        {['Kanban', 'Sprint', 'List'].map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setView(v as 'Kanban' | 'Sprint' | 'List')}
            className={`rounded-full px-3 py-1 ${view === v ? 'bg-[#2E8BFF]' : 'bg-transparent'}`}
          >
            <Text className={`font-semibold ${view === v ? 'text-white' : 'text-gray-800'}`}>
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List search */}
      {view === 'List' && (
        <View className="flex-row items-center justify-between gap-2 px-3 py-3">
          <TextInput
            placeholder="Search tasks..."
            value={query}
            onChangeText={setQuery}
            className="mr-2 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2"
          />
          <Text className="text-gray-600">
            {loading ? 'Loading…' : `${listTasks.length} tasks`}
          </Text>
        </View>
      )}

      {/* Kanban */}
      {projectId && view === 'Kanban' && (
        <View style={{ flex: 1, paddingBottom: 100 }}>
          <KanbanBySprintBoard
            projectId={projectId}
            sprints={sprints}
            filterCategory={kanbanFilter}
            onMarkDone={eventApi.onMarkDone}
            onNext={eventApi.onNext}
            onSplit={eventApi.onSplit}
            onMoveNext={eventApi.onMoveNext}
            onMoveToSprint={eventApi.onMoveToSprint}
          />
        </View>
      )}

      {/* Sprint */}
      {view === 'Sprint' && <SprintInfoSection />}

      {/* List */}
      {view === 'List' && (
        <ListInfoSection
          tasks={tasks}
          onMarkDone={eventApi.onMarkDone}
          onNext={eventApi.onNext}
          onSplit={eventApi.onSplit}
          onMoveNext={eventApi.onMoveNext}
        />
      )}
    </View>
  );
}
