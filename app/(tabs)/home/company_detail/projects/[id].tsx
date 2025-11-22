// app/(tabs)/home/company_detail/projects/[id].tsx
import ProjectFilterModal from '@/components/project-layout/ProjectFilterModal';
import { Project, ProjectFilter } from '@/interfaces/project';
import { ROUTES } from '@/routes/route';
import { loadProjects } from '@/src/services/projectService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BarChart2, Columns3, LayoutGrid, List } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const statusColumns: Project['status'][] = ['Planned', 'InProgress', 'OnHold', 'Completed'];

const Projects = () => {
  const router = useRouter();

  const { id: companyId } = useLocalSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'kanban'>('card');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filter, setFilter] = useState<ProjectFilter>({});

  // fetch projects
  const fetchProjects = useCallback(
    async (appliedFilter?: ProjectFilter) => {
      if (!companyId) return;
      setLoading(true);
      try {
        const res = await loadProjects({
          companyId: String(companyId),
          q: appliedFilter?.search || '',
          statuses: appliedFilter?.status || [],
          sort: appliedFilter?.sort || 'recent',
          pageNumber: 1,
          pageSize: 50,
        });
        setProjects(res.data.items || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [companyId],
  );

  useEffect(() => {
    fetchProjects(filter);
  }, [filter, fetchProjects]);

  if (loading) return <ActivityIndicator size="large" className="flex-1" />;

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <StatusBar hidden />

      {/* Top Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setFilterModalVisible(true)}
        >
          <BarChart2 size={28} color="#2563EB" />
          <View className="ml-2">
            <Text className="text-base font-bold">Browse filters</Text>
            <Text className="text-xs text-gray-500">Jump back to your work</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => setViewMode('card')}
            className={`rounded p-2 ${viewMode === 'card' ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <LayoutGrid size={20} color={viewMode === 'card' ? 'white' : '#333'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`rounded p-2 ${viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <List size={20} color={viewMode === 'list' ? 'white' : '#333'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode('kanban')}
            className={`rounded p-2 ${viewMode === 'kanban' ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <Columns3 size={20} color={viewMode === 'kanban' ? 'white' : '#333'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card View */}
      {viewMode === 'card' && (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-4 rounded-xl bg-white p-4 shadow-md">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-xs font-semibold text-blue-600">{item.code}</Text>
                <View
                  className={`rounded-full px-2 py-1 ${
                    item.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-semibold ${
                      item.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text className="mb-1 text-base font-bold">{item.name}</Text>
              <Text className="mb-1 text-gray-600">
                {item.companyName} — {item.workflow || 'WorkflowA'}
              </Text>
              <Text className="mb-2 text-xs text-gray-500">
                {item.startDate} — {item.endDate}
              </Text>

              <View className="mb-2 flex-row space-x-2">
                <View className="rounded-full bg-blue-100 px-2 py-1">
                  <Text className="text-xs font-semibold text-blue-600">
                    {item.ptype || 'Internal'}
                  </Text>
                </View>
              </View>

              <Text numberOfLines={2} className="mb-2 text-xs leading-4 text-gray-600">
                {item.description}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  router.push(`${ROUTES.PROJECT.DETAIL}/${item.id}` as any);
                }}
                className="self-start rounded-md bg-blue-600 px-4 py-2"
              >
                <Text className="font-semibold text-white">Open →</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Header */}
            <View className="flex-row bg-gray-200 p-3">
              {['Code', 'Name', 'Owner', 'Hired Company', 'Workflow', 'Status', 'Type'].map(
                (header) => (
                  <Text key={header} className="mr-3 w-28 text-xs font-bold">
                    {header}
                  </Text>
                ),
              )}
            </View>

            {/* Rows */}
            {projects.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`${ROUTES.PROJECT.DETAIL}/${item.id}` as any)}
              >
                <View
                  key={item.id}
                  className={`flex-row p-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <Text className="mr-3 w-28 text-xs">{item.code}</Text>
                  <Text className="mr-3 w-28 text-xs">{item.name}</Text>
                  <Text className="mr-3 w-28 text-xs">{item.ownerCompany || 'N/A'}</Text>
                  <Text className="mr-3 w-28 text-xs">{item.hiredCompany || 'N/A'}</Text>
                  <Text className="mr-3 w-28 text-xs">{item.workflow || 'WorkflowA'}</Text>
                  <View
                    className={`mr-3 w-28 rounded border px-1 py-0.5 ${
                      item.status === 'Completed' ? 'border-green-600' : 'border-yellow-600'
                    }`}
                  >
                    <Text
                      className={`text-center text-[10px] font-semibold ${
                        item.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <Text className="mr-3 w-28 text-xs">{item.ptype || 'Internal'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
          {statusColumns.map((status) => (
            <View key={status} className="m-2 w-64 rounded-lg bg-gray-100 p-2">
              <Text className="mb-2 text-sm font-bold">{status}</Text>

              {projects
                .filter((p) => p.status === status)
                .map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => router.push(`${ROUTES.PROJECT.DETAIL}/${p.id}` as any)}
                  >
                    <View key={p.id} className="mb-2 rounded bg-white p-3 shadow">
                      <View className="flex-row items-start justify-between">
                        <Text className="text-xs font-semibold">{p.name}</Text>
                        <View className="rounded bg-blue-100 px-2 py-0.5">
                          <Text className="text-[10px] font-semibold text-blue-600">
                            {p.ptype || 'Internal'}
                          </Text>
                        </View>
                      </View>

                      {/* Code */}
                      <Text className="mt-1 text-[10px] text-gray-500">{p.code}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <ProjectFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(f: ProjectFilter) => setFilter(f)}
        onReset={() => setFilter({})}
      />
    </View>
  );
};

export default Projects;
