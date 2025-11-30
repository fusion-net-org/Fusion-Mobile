import AlertHeader from '@/components/layouts/alert-header';
import { ProjectInfo } from '@/interfaces/project';
import { TaskItem } from '@/interfaces/task';
import { ROUTES } from '@/routes/route';
import { GetProjectByUserId } from '@/src/services/projectService';
import { GetPageTasksByUserId } from '@/src/services/taskService';
import LoadingOverlay from '@/src/utils/loadingOverlay';
import { router } from 'expo-router';
import { ArrowLeft, ArrowUpRightSquareIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function WorkspacePage() {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');

  // ===================== STYLE FUNCTIONS =====================
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Planned':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'InProgress':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'OnHold':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'Completed':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const getPriorityColor = (priority?: TaskItem['priority']) => {
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Done':
        return '#10B981';
      case 'In Progress':
        return '#FACC15';
      case 'Pending':
        return '#F59E0B';
      case 'OverDue':
        return '#EF4444';
      default:
        return '#6B7280';
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

  // ===================== LOAD DATA =====================
  const loadProjects = async () => {
    setLoading(true);
    const res: any = await GetProjectByUserId('');
    setProjects(res?.data?.items || []);
    setLoading(false);
  };

  const loadTasks = async (projectId?: string) => {
    setLoading(true);
    let res: any;
    if (projectId) {
      res = await GetPageTasksByUserId({ pageNumber: 1, pageSize: 100, projectId });
    } else {
      res = await GetPageTasksByUserId({ pageNumber: 1, pageSize: 100 });
    }
    setTasks(res?.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  const cardColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-indigo-100',
  ];

  return (
    <>
      <AlertHeader />
      <View className="flex-1 bg-gray-100">
        {/* HEADER */}
        <View className="flex-row items-center justify-between bg-white p-4 shadow">
          <Text className="text-lg font-bold">Workspace</Text>
        </View>

        {/* TABS */}
        <View className="mb-4 flex-row space-x-2 bg-white p-2 shadow">
          <TouchableOpacity
            className={`flex-1 items-center rounded-full py-2 ${activeTab === 'projects' ? 'bg-blue-600' : 'bg-gray-200'}`}
            onPress={() => setActiveTab('projects')}
          >
            <Text
              className={`font-medium ${activeTab === 'projects' ? 'text-white' : 'text-gray-700'}`}
            >
              Projects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center rounded-full py-2 ${activeTab === 'tasks' ? 'bg-blue-600' : 'bg-gray-200'}`}
            onPress={() => setActiveTab('tasks')}
          >
            <Text
              className={`font-medium ${activeTab === 'tasks' ? 'text-white' : 'text-gray-700'}`}
            >
              Tasks
            </Text>
          </TouchableOpacity>
        </View>

        {/* PROJECT TAB */}
        {activeTab === 'projects' && (
          <ScrollView className="p-4">
            {projects.map((project, index) => {
              const bgColor = cardColors[index % cardColors.length];
              const statusStyle = getStatusStyle(project.status);
              return (
                <TouchableOpacity
                  key={project.id}
                  onPress={() => {
                    router.push(`${ROUTES.PROJECT.DETAIL}/${project.id}` as any);
                  }}
                  className={`mb-4 rounded-xl p-4 shadow ${bgColor}`}
                >
                  <Text className="mb-1 text-lg font-bold">{project.name}</Text>
                  <Text className="mb-2 text-sm text-gray-500">{project.description}</Text>
                  <View className="mb-1 flex-row items-center space-x-2">
                    <Text
                      className={`rounded px-2 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs font-semibold`}
                    >
                      {project.status}
                    </Text>
                    <Text className="rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
                      Workflow: {project.workflowName || '-'}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-400">
                    Duration: {project.startDate} → {project.endDate}
                  </Text>

                  <TouchableOpacity
                    className="mt-2 self-start rounded-lg bg-blue-600 px-3 py-1"
                    onPress={() => {
                      setSelectedProject(project);
                      loadTasks(project.id);
                      setActiveTab('tasks');
                    }}
                  >
                    <Text className="text-sm text-white">Show Tasks</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* TASK TAB */}
        {activeTab === 'tasks' && (
          <ScrollView className="p-4">
            {selectedProject && (
              <View className="mb-3 flex-row items-center justify-between space-x-2">
                <Text className="flex-1 text-base font-semibold">
                  Tasks in {selectedProject.name}
                </Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className=" rounded-lg bg-gray-500 p-3"
                    onPress={() => setActiveTab('projects')}
                  >
                    <ArrowLeft size={20} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="ml-3 rounded-lg bg-blue-600 p-3"
                    onPress={() => {
                      setSelectedProject(null);
                      loadTasks();
                    }}
                  >
                    <ArrowUpRightSquareIcon size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {tasks.map((item) => {
              const priority = {
                bg:
                  item.priority === 'High'
                    ? 'bg-orange-100'
                    : item.priority === 'Urgent'
                      ? 'bg-red-100'
                      : item.priority === 'Medium'
                        ? 'bg-yellow-100'
                        : 'bg-green-100',
                text:
                  item.priority === 'High'
                    ? 'text-orange-600'
                    : item.priority === 'Urgent'
                      ? 'text-red-600'
                      : item.priority === 'Medium'
                        ? 'text-yellow-600'
                        : 'text-green-600',
              };
              const statusColor =
                item.status === 'Done'
                  ? 'text-green-500'
                  : item.status === 'In Progress'
                    ? 'text-yellow-500'
                    : item.status === 'Pending'
                      ? 'text-orange-500'
                      : 'text-red-500';
              const severityColor =
                item.severity === 'Critical'
                  ? 'text-red-600'
                  : item.severity === 'High'
                    ? 'text-orange-600'
                    : item.severity === 'Medium'
                      ? 'text-yellow-600'
                      : 'text-green-600';

              return (
                <TouchableOpacity
                  key={item.taskId}
                  onPress={() =>
                    router.push({
                      pathname: ROUTES.TASK.WORKSPACE_TASK as any,
                      params: { id: item.taskId, backRoute: ROUTES.HOME.WORKSPACE },
                    })
                  }
                  className="m-3 rounded-xl bg-white p-4 shadow-md"
                >
                  <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>

                  <View className="mt-2 flex-row items-center justify-between">
                    <View className="flex-row flex-wrap items-center">
                      <Text className="ml-1 text-sm text-gray-500">
                        {Array.from(new Set(item.members?.map((m) => m.memberName))).join(', ') ||
                          'N/A'}
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
                        <Text className="text-xs text-gray-500">
                          Workflow: {item.project.workflowName}
                        </Text>
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
            })}
          </ScrollView>
        )}

        {/* LOADING */}
        {loading && <LoadingOverlay loading={loading} message="Loading, please wait..." />}
      </View>
    </>
  );
}
