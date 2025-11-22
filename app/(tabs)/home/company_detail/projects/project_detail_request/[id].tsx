import MembersSection from '@/components/project_detail_request-layout/MemberSection';
import SprintSection from '@/components/project_detail_request-layout/SprintSection';
import TicketSection from '@/components/project_detail_request-layout/TicketSection';
import { GetProjectByProjectId } from '@/src/services/projectService';
import { GetTicketByProjectId } from '@/src/services/ticketService';
import { useLocalSearchParams } from 'expo-router';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Layers,
  MessageSquare,
  User,
  Users,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function ProjectDetailRequest() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [project, setProject] = useState<any>();
  const [ticketsCount, setTicketsCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'members' | 'tickets' | 'sprints'>('members');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const proj = await GetProjectByProjectId(projectId);
        const tix = await GetTicketByProjectId(projectId);

        if (proj.status === 404) {
          Toast.show({
            type: 'error',
            text1: 'Project không tồn tại',
            position: 'top',
            visibilityTime: 2000,
          });
          return;
        }

        setProject(proj.data);
        setTicketsCount(tix.data.totalCount);
      } catch (err: any) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: err.message || 'Error fetching data',
          position: 'top',
          visibilityTime: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchData();
    else
      Toast.show({
        type: 'error',
        text1: 'ProjectId not suitable',
        position: 'top',
        visibilityTime: 2000,
      });
  }, [projectId]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  // FlatList ListHeaderComponent
  const renderHeader = () => (
    <>
      {/* HEADER */}
      <View className="mb-5 rounded-3xl bg-white p-5 shadow">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2">
              <Layers size={22} color="#4f46e5" />
              <Text className="text-xl font-bold text-gray-900">{project?.name}</Text>
            </View>
            <Text className="mt-1 text-sm text-gray-500">Code: {project?.code}</Text>
          </View>
          <Text
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              project?.status === 'Ongoing'
                ? 'bg-yellow-100 text-yellow-700'
                : project?.status === 'Done'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600'
            }`}
          >
            {project?.status}
          </Text>
        </View>
      </View>

      {/* INFO */}
      <View className="flex-row flex-wrap justify-between">
        {[
          {
            label: 'Start Date',
            value: project?.startDate,
            icon: <Calendar size={18} color="#6366f1" />,
          },
          {
            label: 'End Date',
            value: project?.endDate,
            icon: <Calendar size={18} color="#6366f1" />,
          },
          {
            label: 'Created By',
            value: project?.ownerName,
            icon: <User size={18} color="#6366f1" />,
          },
          {
            label: 'Company Request',
            value: project?.companyRequestName,
            icon: <User size={18} color="#6366f1" />,
          },
          {
            label: 'Company Executor',
            value: project?.companyExecutorName,
            icon: <User size={18} color="#6366f1" />,
          },
        ].map((item, idx) => (
          <InfoItem key={idx} label={item.label} value={item.value} icon={item.icon} />
        ))}
      </View>

      {/* DESCRIPTION */}
      <View className="mt-4 rounded-2xl bg-white p-4 shadow">
        <View className="mb-2 flex-row items-center gap-2">
          <ClipboardList size={18} color="#4f46e5" />
          <Text className="font-semibold text-gray-700">Description</Text>
        </View>
        <Text className="text-base text-gray-600">
          {project?.description || 'No description available.'}
        </Text>
      </View>

      {/* PROGRESS */}
      <View className="mt-4 rounded-2xl bg-white p-4 shadow">
        <View className="mb-3 flex-row items-center gap-2">
          <CheckCircle2 size={18} color="#22c55e" />
          <Text className="font-semibold text-gray-700">Project Progress</Text>
        </View>
        <ProgressBar
          progress={(project?.progress ?? 0) / 100}
          color="#4f46e5"
          style={{ height: 10, borderRadius: 10 }}
        />
        <Text className="mt-2 text-right font-semibold text-gray-700">
          {(project?.progress ?? 0).toFixed(2)}%
        </Text>
      </View>

      {/* TABS */}
      <View className="mt-6 flex-row gap-2">
        {[
          {
            label: 'Members',
            key: 'members',
            icon: <Users size={18} color={activeTab === 'members' ? '#4f46e5' : '#6b7280'} />,
            badge: project.membersCount,
          },
          {
            label: 'Tickets',
            key: 'tickets',
            icon: (
              <MessageSquare size={18} color={activeTab === 'tickets' ? '#4f46e5' : '#6b7280'} />
            ),
            badge: ticketsCount,
          },
          {
            label: 'Sprints',
            key: 'sprints',
            icon: <BarChart3 size={18} color={activeTab === 'sprints' ? '#4f46e5' : '#6b7280'} />,
            badge: project.sprintCount,
          },
        ].map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            badge={tab.badge}
            active={activeTab === tab.key}
            onPress={() => setActiveTab(tab.key as any)}
          />
        ))}
      </View>

      <View className="mt-6" />
    </>
  );

  // TAB CONTENT
  const renderTabContent = () => {
    if (activeTab === 'members') return <MembersSection projectId={projectId} rowsPerPage={4} />;
    if (activeTab === 'tickets') return <TicketSection projectId={projectId} />;
    if (activeTab === 'sprints') return <SprintSection projectId={projectId} />;
    return null;
  };

  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <>
          {renderHeader()}
          {renderTabContent()}
        </>
      }
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
    />
  );
}

const InfoItem = ({ icon, label, value }: any) => (
  <View className="mb-3 w-[48%] rounded-2xl bg-white p-3 shadow">
    <View className="mb-1 flex-row items-center gap-2">
      {icon}
      <Text className="text-sm text-gray-500">{label}</Text>
    </View>
    <Text className="font-semibold text-gray-800">{value || '-'}</Text>
  </View>
);

const TabButton = ({ label, icon, active, badge, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`
      flex-1 flex-row items-center justify-center 
      rounded-lg border px-2 py-1.5
      ${active ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'}
    `}
  >
    <View className="max-w-full flex-row items-center justify-center">
      <View className="scale-90">{icon}</View>

      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className={`ml-1 max-w-[55px] text-xs font-semibold ${
          active ? 'text-indigo-600' : 'text-gray-600'
        }`}
      >
        {label}
      </Text>

      {/* BADGE */}
      {badge > 0 && (
        <View className="ml-1 h-[16px] min-w-[16px] items-center justify-center rounded-full bg-gray-200 px-1">
          <Text className="text-[9px] text-gray-800">{badge}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);
