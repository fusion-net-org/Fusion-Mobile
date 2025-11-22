import { SprintVm } from '@/interfaces/sprint';
import { TaskVm } from '@/interfaces/task';
import { putReorderTask } from '@/src/services/taskService';
import { useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import TaskInfoSection from './TaskInfoSection';

const screenW = Dimensions.get('window').width;
const COL_W = Math.min(420, Math.max(300, screenW * 0.78));

type Props = {
  projectId: string;
  sprints: SprintVm[];
  filterCategory?: string;
  onMarkDone: (t: TaskVm) => void;
  onNext: (t: TaskVm) => void;
  onSplit: (t: TaskVm) => void;
  onMoveNext: (t: TaskVm) => void;
  onMoveToSprint: (t: TaskVm, toSprintId: string) => void;
};

export default function KanbanBySprintBoard({
  projectId,
  sprints,
  filterCategory = 'ALL',
  onMarkDone,
  onNext,
  onSplit,
  onMoveNext,
  onMoveToSprint,
}: Props) {
  const flattenSprintTasks = (s: SprintVm) => {
    const order = s.statusOrder ?? Object.keys(s.columns ?? {});
    const out: TaskVm[] = [];
    for (const stId of order) {
      const arr = (s.columns?.[stId] as TaskVm[]) ?? [];
      out.push(...arr.map((t) => ({ ...t, workflowStatusId: t.workflowStatusId ?? stId })));
    }
    return out;
  };

  const [tasksState, setTasksState] = useState<{ [sprintId: string]: TaskVm[] }>(() =>
    sprints.reduce(
      (acc, s) => {
        acc[s.id] = flattenSprintTasks(s);
        return acc;
      },
      {} as { [sprintId: string]: TaskVm[] },
    ),
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-3">
      {sprints.map((s) => {
        const tasks =
          tasksState[s.id]?.filter((t) =>
            filterCategory === 'ALL' ? true : t.statusCategory === filterCategory,
          ) ?? [];

        const total = tasks.length;
        const doneCount = tasks.filter((t) => t.statusCategory === 'DONE').length;
        const pct = total ? Math.round((doneCount / total) * 100) : 0;

        return (
          <View
            key={s.id}
            style={{ width: COL_W }}
            className="mx-2 rounded-xl bg-white pb-4 pt-2 shadow-md"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-3.5 pb-2">
              <Text className="font-bold">{s.name}</Text>
              <Text className="font-semibold text-green-700">
                {total} • {pct}%
              </Text>
            </View>

            {/* Progress */}
            <View className="px-2.5">
              <View className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
                <View style={{ width: `${pct}%` }} className="h-full bg-blue-600" />
              </View>

              {/* DRAG LIST */}
              <DraggableFlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                activationDistance={2}
                containerStyle={{ flexGrow: 1 }}
                contentContainerStyle={{ paddingBottom: 80 }}
                animationConfig={{
                  damping: 20,
                  stiffness: 200,
                  mass: 0.5,
                }}
                renderPlaceholder={() => (
                  <View className="mb-2 h-[115px] rounded-lg bg-gray-100 opacity-40" />
                )}
                onDragEnd={({ data, from, to }) => {
                  const movedTask = data[to];
                  const fromStatus = tasks[from].workflowStatusId;
                  const toStatus = movedTask.workflowStatusId;

                  setTasksState((prev) => ({ ...prev, [s.id]: data }));

                  if (fromStatus === toStatus) {
                    putReorderTask(projectId, s.id, {
                      taskId: movedTask.id,
                      toStatusId: toStatus,
                      toIndex: to,
                    }).catch((err) => console.log('Reorder failed', err));
                  }
                }}
                renderItem={({ item, drag, isActive }) => (
                  <TaskInfoSection
                    t={item}
                    isActive={isActive}
                    onLongPress={drag}
                    onMarkDone={() => onMarkDone(item)}
                    onNext={() => onNext(item)}
                    onSplit={() => onSplit(item)}
                    onMoveNext={() => onMoveNext(item)}
                    onMoveToSprint={(id: string) => onMoveToSprint(item, id)}
                  />
                )}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
