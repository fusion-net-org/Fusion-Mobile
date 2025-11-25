import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { TaskItem } from '@/interfaces/task';
import { TaskComment } from '@/interfaces/task_comment';
import { GetDetailTasksByUserId } from '@/src/services/taskService';
import { downloadAndOpenFile } from '@/src/utils/dowloadFile';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Activity,
  Box,
  Calendar,
  ClipboardList,
  Flag,
  GitMerge,
  Info,
  Star,
  Tag,
  Timer,
  Trash2,
} from 'lucide-react-native';
import { Avatar } from 'react-native-paper';

interface TaskDetailSectionProps {
  taskId: string;
  backRoute?: string;
}

const TaskDetailSection = ({ taskId, backRoute }: TaskDetailSectionProps) => {
  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'checklist' | 'comments' | 'activities'>('checklist');
  const [commentsWithUser, setCommentsWithUser] = useState<CommentWithUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  interface CommentWithUser extends TaskComment {
    authorUserName?: string;
    authorUserAvatar?: string;
  }

  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUserId(user.id);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async () => {
      setLoading(true);
      const data = await GetDetailTasksByUserId(taskId as string);
      setTask(data);
      setLoading(false);
    };
    fetchTask();
  }, [taskId]);

  useEffect(() => {
    if (!task?.comments?.length || !task?.members?.length) return;

    // Tạo map memberId => member info
    const membersMap: Record<string, { name: string; avatar: string }> = {};
    task.members.forEach((m) => {
      membersMap[m.memberId] = { name: m.memberName, avatar: m.avatar };
    });

    // Map comment + lấy author info từ membersMap
    const newComments = task.comments.map((c) => ({
      ...c,
      authorUserName: membersMap[c.authorUserId]?.name ?? c.authorUserId,
      authorUserAvatar: membersMap[c.authorUserId]?.avatar ?? '',
    }));

    setCommentsWithUser(newComments);
  }, [task?.comments, task?.members]);

  // Helpers: set màu theo value
  const getPriorityColor = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'Urgent':
        return '#DC2626';
      case 'High':
        return '#F97316';
      case 'Medium':
        return '#FBBF24';
      case 'Low':
        return '#16A34A';
      default:
        return '#111827';
    }
  };

  const getSeverityColor = (severity?: TaskItem['severity']) => {
    switch (severity) {
      case 'Critical':
        return '#DC2626';
      case 'High':
        return '#F97316';
      case 'Medium':
        return '#FBBF24';
      case 'Low':
        return '#16A34A';
      default:
        return '#111827';
    }
  };

  const getTypeColor = (type: TaskItem['type']) => {
    switch (type) {
      case 'Bug':
        return '#DC2626';
      case 'Feature':
        return '#3B82F6';
      case 'Chore':
        return '#6B7280';
      default:
        return '#111827';
    }
  };

  const uniqueMembers = task?.members?.filter(
    (m, index, self) => index === self.findIndex((x) => x.memberId === m.memberId),
  );

  const handleDelete = (id: number) => {};

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2E8BFF" />
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Task not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4" contentContainerStyle={{ paddingBottom: 110 }}>
      {/* Task Information */}
      <View className="mb-5">
        <View className="mb-2 flex-row items-center">
          <ClipboardList size={20} color="#3B82F6" />
          <Text className="ml-2 text-lg font-semibold text-gray-800">Task Information</Text>
        </View>

        <View className="rounded-2xl bg-white p-4 shadow">
          {[
            { icon: <Flag size={18} color="#3B82F6" />, label: 'Status', value: task.status },
            {
              icon: <ClipboardList size={18} color="#3B82F6" />,
              label: 'Title',
              value: task.title,
            },
            {
              icon: <Activity size={18} color="#3B82F6" />,
              label: 'Hours',
              value: `${task.remainingHours ?? '—'}h / ${task.estimateHours ?? '—'}h`,
            },
            {
              icon: <Timer size={18} color="#3B82F6" />,
              label: 'Due Date',
              value: formatLocalDate(task.dueDate),
            },
            {
              icon: <Tag size={18} color="#3B82F6" />,
              label: 'Tag',
              value: (
                <View className="flex-row justify-end">
                  <Text
                    className="font-semibold"
                    style={{ color: getSeverityColor(task.severity) }}
                  >
                    {task.severity}
                  </Text>
                  <Text className="font-semibold text-gray-900"> • </Text>
                  <Text
                    className="font-semibold"
                    style={{ color: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </Text>
                </View>
              ),
            },
            {
              icon: <Box size={18} color="#3B82F6" />,
              label: 'Type',
              value: task.type,
              color: getTypeColor(task.type),
            },
            {
              icon: <Star size={18} color="#3B82F6" />,
              label: 'Point',
              value: task.point ?? '—',
            },
          ].map((item, i) => (
            <View key={i} className="mb-2 flex-row items-center">
              <View className="w-32 flex-row items-center">
                {item.icon}
                <Text className="ml-2 font-medium text-gray-700">{item.label}</Text>
              </View>

              <View className="ml-10 flex-1 pl-5 pt-1">
                {(typeof item.value as string) ? (
                  <Text
                    className="font-semibold text-gray-900"
                    style={{ color: item.color ?? '#111827' }}
                  >
                    {item.value}
                  </Text>
                ) : (
                  item.value
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Assignees */}
      <View className="mb-5">
        <View className="mb-2 flex-row items-center">
          <GitMerge size={20} color="#3B82F6" />
          <Text className="ml-2 text-lg font-semibold text-gray-800">Assignees</Text>
        </View>

        <View className="flex-row rounded-2xl bg-white p-4 shadow">
          {uniqueMembers?.map((u, i) => (
            <View key={i} className="mr-4 flex-row items-center">
              <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                {u.avatar ? (
                  <Image source={{ uri: u.avatar }} className="h-10 w-10" resizeMode="cover" />
                ) : (
                  <Text className="font-semibold text-gray-600">{u.memberName?.[0] ?? '?'}</Text>
                )}
              </View>

              <Text className="ml-2 font-medium text-gray-700">{u.memberName}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Description */}
      <View className="mb-5">
        <View className="mb-2 flex-row items-center">
          <Info size={20} color="#3B82F6" />
          <Text className="ml-2 text-lg font-semibold text-gray-800">Description</Text>
        </View>

        <View className="rounded-2xl bg-white p-4 shadow">
          <Text className="text-gray-600">{task.description ?? 'No description'}</Text>
        </View>
      </View>

      {/* Project Info */}
      <View className="mb-5">
        <View className="mb-2 flex-row items-center">
          <GitMerge size={20} color="#3B82F6" />
          <Text className="ml-2 text-lg font-semibold text-gray-800">Project Info</Text>
        </View>
        <View className="space-y-2 rounded-2xl bg-white p-4 shadow">
          {[
            {
              icon: <GitMerge size={18} color="#3B82F6" />,
              label: 'Information',
              value: `${task.project?.name ?? '—'} - ${task.project?.code ?? '—'}`,
            },
            {
              icon: <Flag size={18} color="#3B82F6" />,
              label: 'Status',
              value: task.project?.status ?? 'Unknown',
            },
            {
              icon: <Calendar size={18} color="#3B82F6" />,
              label: 'Date',
              value: `${formatLocalDate(task.project?.startDate ?? '')} - ${formatLocalDate(task.project?.endDate ?? '')}`,
            },
            {
              icon: <Info size={18} color="#3B82F6" />,
              label: 'Description',
              value: task.project?.description ?? 'No description',
            },
          ].map((item, i) => (
            <View key={i} className="mb-2 flex-row items-center">
              <View className="w-32 flex-row items-center">
                {item.icon}
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="ml-2 font-medium text-gray-700"
                >
                  {item.label}
                </Text>
              </View>

              <View className="ml-4 flex-1 pl-6">
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="font-semibold text-gray-900"
                >
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Attachments */}
      <View className="mb-5">
        <View className="mb-2 flex-row items-center">
          <Flag size={20} color="#3B82F6" />
          <Text className="ml-2 text-lg font-semibold text-gray-800">Attachments</Text>
        </View>

        {/* Task Attachments */}
        <View className="space-y-2 rounded-2xl bg-white p-4 shadow">
          {task.taskAttachments && task.taskAttachments.length > 0 ? (
            task.taskAttachments.map((file, i) => {
              // format size
              const sizeInKB = file.size / 1024;
              const sizeText =
                sizeInKB < 1024
                  ? `${sizeInKB.toFixed(2)} KB`
                  : `${(sizeInKB / 1024).toFixed(2)} MB`;

              return (
                <View key={i} className="mb-2 flex-row items-center rounded-lg bg-gray-100 p-3">
                  <ClipboardList size={18} color="#3B82F6" />
                  <Text className="ml-2 flex-1 text-gray-700">
                    {file.fileName} ({sizeText})
                  </Text>
                  <Text
                    className="text-blue-600"
                    onPress={() => {
                      downloadAndOpenFile(file.url, file.fileName);
                    }}
                  >
                    Download
                  </Text>
                </View>
              );
            })
          ) : (
            <Text className="text-center text-gray-500">No attachments</Text>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="mb-3 flex-row rounded-xl bg-white shadow">
        {['checklist', 'comments', 'activities'].map((t) => (
          <Text
            key={t}
            onPress={() => setActiveTab(t as any)}
            className={`flex-1 py-3 text-center font-semibold ${
              activeTab === t ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Text>
        ))}
      </View>

      {/* Subtasks */}
      {activeTab === 'checklist' && (
        <View className="rounded-2xl bg-white p-4 shadow">
          <Text className="mb-2 font-semibold text-gray-700">Task Process</Text>

          {/* <View className="h-3 overflow-hidden rounded-full bg-gray-200">
            <View className="h-3 bg-blue-600" style={{ width: `${task.progress ?? 50}%` }} />
          </View> */}

          {task.checklist && task.checklist.length > 0 ? (
            <View className="mt-2">
              {/* Progress Bar */}
              <View className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <View
                  className="absolute h-3 bg-blue-600"
                  style={{
                    width: `${(task.checklist.filter((s) => s.isDone).length / task.checklist.length) * 100}%`,
                  }}
                />
              </View>
              {/* Text Done / Total */}
              <Text className="mt-1 text-right text-xs text-gray-700">
                {task.checklist.filter((s) => s.isDone).length} / {task.checklist.length}
              </Text>

              {/* Checklist Items */}
              {task.checklist
                .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                .map((s, i) => (
                  <View key={i} className="mt-3 flex-row items-start">
                    <View
                      className={`mr-3 h-5 w-5 rounded-md border ${
                        s.isDone ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                      }`}
                    />
                    <Text
                      className={`flex-1 ${s.isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                    >
                      {s.label}
                    </Text>
                  </View>
                ))}
            </View>
          ) : (
            <Text className="italic text-gray-400">No checklist found</Text>
          )}
        </View>
      )}

      {/* Comments */}
      {activeTab === 'comments' && (
        <View className="rounded-2xl bg-white p-4 shadow">
          {commentsWithUser && commentsWithUser.length > 0 ? (
            commentsWithUser.map((c) => (
              <View
                key={c.id}
                className="mb-2 flex-row gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                {/* Avatar */}
                <Avatar.Image size={40} source={{ uri: c.authorUserAvatar }} />

                {/* Info */}
                <View className="flex-1">
                  <Text className="font-bold">{c.authorUserName}</Text>
                  <Text className="text-xs text-gray-500">{formatLocalDate(c.createAt)}</Text>
                  <Text className="mt-1 text-gray-700">{c.body}</Text>
                </View>

                {/* Delete button nếu là owner */}
                {currentUserId === c.authorUserId && (
                  <TouchableOpacity onPress={() => handleDelete(c.id)}>
                    <Trash2 size={18} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text className="text-gray-400">No comments</Text>
          )}
        </View>
      )}

      {/* Activities */}
      {/* {activeTab === 'activities' && (
        <View className="rounded-2xl bg-white p-4 shadow">
          {task.activities?.length ? (
            task.activities.map((a, i) => (
              <View key={i} className="mb-2 flex-row">
                <View className="mr-2 mt-2 h-2 w-2 rounded-full bg-blue-600" />
                <Text className="text-gray-600">{a}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-400">No activity</Text>
          )}
        </View>
      )} */}
    </ScrollView>
  );
};

export default TaskDetailSection;
