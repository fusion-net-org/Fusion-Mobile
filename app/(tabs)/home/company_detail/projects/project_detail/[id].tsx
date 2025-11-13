import { getProjectMemberByProjectId } from '@/src/services/projectMemberService';
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
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';

export default function ProjectDetailRequest() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [project, setProject] = useState<any>();
  const [membersCount, setMembersCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'members' | 'tickets' | 'sprints'>('members');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proj = await GetProjectByProjectId(projectId);
        const mem = await getProjectMemberByProjectId(projectId);
        const tix = await GetTicketByProjectId(projectId);
        setProject(proj);
        setMembersCount(mem.totalCount);
        setTicketsCount(tix.totalCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-6">
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
        <InfoItem
          label="Start Date"
          icon={<Calendar size={18} color="#6366f1" />}
          value={project?.startDate}
        />
        <InfoItem
          label="End Date"
          icon={<Calendar size={18} color="#6366f1" />}
          value={project?.endDate}
        />
        <InfoItem
          label="Created By"
          icon={<User size={18} color="#6366f1" />}
          value={project?.createByName}
        />
        <InfoItem
          label="Company Request"
          icon={<User size={18} color="#6366f1" />}
          value={project?.companyRequestName}
        />
        <InfoItem
          label="Company Executor"
          icon={<User size={18} color="#6366f1" />}
          value={project?.companyExecutorName}
        />
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
        <ProgressBar progress={0.8} color="#4f46e5" style={{ height: 10, borderRadius: 10 }} />
        <Text className="mt-2 text-right font-semibold text-gray-700">80%</Text>
      </View>

      {/* TABS */}
      <View className="mt-6 flex-row justify-around">
        <TabButton
          label="Members"
          icon={<Users size={18} color={activeTab === 'members' ? '#4f46e5' : '#6b7280'} />}
          active={activeTab === 'members'}
          badge={membersCount}
          onPress={() => setActiveTab('members')}
        />
        <TabButton
          label="Tickets"
          icon={<MessageSquare size={18} color={activeTab === 'tickets' ? '#4f46e5' : '#6b7280'} />}
          active={activeTab === 'tickets'}
          badge={ticketsCount}
          onPress={() => setActiveTab('tickets')}
        />
        <TabButton
          label="Sprints"
          icon={<BarChart3 size={18} color={activeTab === 'sprints' ? '#4f46e5' : '#6b7280'} />}
          active={activeTab === 'sprints'}
          badge={4}
          onPress={() => setActiveTab('sprints')}
        />
      </View>

      {/* TAB CONTENT */}
      <View className="mt-6">
        {activeTab === 'members' && (
          <View className="rounded-2xl bg-white p-5 shadow">
            <Text className="font-semibold text-gray-700">👥 Members tab content here</Text>
          </View>
        )}
        {activeTab === 'tickets' && (
          <View className="rounded-2xl bg-white p-5 shadow">
            <Text className="font-semibold text-gray-700">🎟️ Tickets tab content here</Text>
          </View>
        )}
        {activeTab === 'sprints' && (
          <View className="rounded-2xl bg-white p-5 shadow">
            <Text className="font-semibold text-gray-700">🏃 Sprint tab content here</Text>
          </View>
        )}
      </View>

      <View className="mb-20" />
    </ScrollView>
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
    className={`flex items-center justify-center rounded-xl px-3 py-2 ${
      active ? 'border border-indigo-200 bg-indigo-50' : 'bg-gray-100'
    }`}
  >
    {icon}
    <Text className={`mt-1 text-sm font-semibold ${active ? 'text-indigo-700' : 'text-gray-600'}`}>
      {label}
    </Text>
    <View className={`mt-1 rounded-full px-2 py-0.5 ${active ? 'bg-indigo-100' : 'bg-gray-200'}`}>
      <Text className={`${active ? 'text-indigo-700' : 'text-gray-600'} text-xs font-medium`}>
        {badge}
      </Text>
    </View>
  </TouchableOpacity>
);
