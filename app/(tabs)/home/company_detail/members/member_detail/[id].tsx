import {
  Calendar,
  Clock,
  Folder,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Star,
} from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { emptyImages } from '@/constants/image/image';
import { ROUTES } from '@/routes/route';
import { GetCompanyMemberByCompanyIdAndUserId } from '@/src/services/memberService';
import { getProjectMemberByCompanyIdAndUserId } from '@/src/services/projectMemberService';
import { getUserById } from '@/src/services/userService';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function MemberDetail() {
  const { id: userId, companyId } = useLocalSearchParams<{
    id: string;
    companyId: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);
  const [infoHeight, setInfoHeight] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [showPerformance, setShowPerformance] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const tabBarHeight = useBottomTabBarHeight();
  const [search, setSearch] = useState('');

  const MAX_CARD_HEIGHT = 500;
  const screenWidth = Dimensions.get('window').width;

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await getUserById(userId);
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch member
  const fetchMember = async () => {
    try {
      const res = await GetCompanyMemberByCompanyIdAndUserId(companyId, userId);
      const data = res.data;
      const perf = {
        productivity: data.productivity ?? 0,
        communication: data.communication ?? 0,
        teamwork: data.teamwork ?? 0,
        problemSolving: data.problemSolving ?? 0,
      };
      setMember(data);
      setPerformance(perf);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoadingProject(true);
      const res = await getProjectMemberByCompanyIdAndUserId(companyId, userId, search);
      const companyData = res.data.items[0];
      setProjects(companyData.projects);
      setProjectCount(companyData.totalProject);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'No projects found for this member in the specified company',
        text2: 'Find Something else',
        position: 'top',
      });

      setProjects([]);
    } finally {
      setLoadingProject(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchUser(), fetchMember(), fetchProjects()]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [search]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        ListHeaderComponent={
          <>
            {/* Slider
            <View style={{ padding: 10, backgroundColor: 'white' }}>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={infoHeight}
                onValueChange={setInfoHeight}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
              />
              <Text className="text-center text-sm text-gray-500">
                {infoHeight > 0.5 ? 'User Info Expanded' : 'User Info Collapsed'}
              </Text>
            </View> */}

            {/* User Card */}
            <TouchableOpacity
              className="pt-5"
              activeOpacity={0.9}
              onPress={() => setInfoHeight(infoHeight > 0.5 ? 0.4 : 1)}
            >
              <View
                style={{
                  maxHeight: infoHeight * MAX_CARD_HEIGHT,
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  padding: 16,
                }}
                className="rounded-2xl shadow"
              >
                <View className="items-center">
                  <Image source={{ uri: user?.avatar }} className="mb-3 h-24 w-24 rounded-full" />
                  <Text className="text-xl font-semibold">{user?.userName}</Text>
                  <Text className="pt-3 text-gray-500">Product Manager</Text>

                  <View className="mt-3 space-y-1">
                    <Text className="flex-row items-center text-gray-700">
                      <Mail size={16} /> {user?.email}
                    </Text>
                    <Text className="flex-row items-center pt-3 text-gray-700">
                      <Phone size={16} /> {user?.phone}
                    </Text>
                    <Text className="flex-row items-center pt-3 text-gray-700">
                      <Calendar size={16} /> Joined:{' '}
                      {member?.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString('vi-VN')
                        : '--'}
                    </Text>
                  </View>

                  {/* Stats */}
                  <View className="mt-5 w-full flex-row justify-between">
                    <View className="flex-1 items-center">
                      <Folder size={24} color="blue" />
                      <Text className="font-bold">{projectCount}</Text>
                      <Text className="text-xs text-gray-500">Projects</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Star size={24} color="orange" />
                      <Text className="font-bold">88</Text>
                      <Text className="text-xs text-gray-500">Score</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Clock size={24} color="purple" />
                      <Text className="font-bold">40</Text>
                      <Text className="text-xs text-gray-500">hr/week</Text>
                    </View>
                  </View>

                  {/* Buttons */}
                  <View className="mt-5 w-full flex-row gap-2">
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-xl bg-gray-200 p-3">
                      <MessageSquare size={18} />
                      <Text className="ml-2 font-semibold">Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-1 flex-row items-center justify-center rounded-xl bg-blue-500"
                      style={{ minHeight: 48 }}
                      onPress={() => setShowPerformance(true)}
                    >
                      <Clock size={18} color="white" />
                      <Text className="ml-2 text-[10px] font-semibold text-white">
                        Performance Overview
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Search */}
            <View className="mx-4 mb-3 mt-5 flex-row items-center rounded-xl bg-white p-3">
              <Search size={18} color="gray" />
              <TextInput
                placeholder="Search project..."
                className="ml-2 flex-1"
                onChangeText={setSearch}
              />
            </View>
          </>
        }
        data={projects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 40,
          paddingHorizontal: 16,
        }}
        ListEmptyComponent={
          !loadingProject ? (
            <View className="mt-10 items-center justify-center">
              <Image
                source={emptyImages.emptyMember}
                style={{ width: 150, height: 150, opacity: 0.5 }}
              />
              <Text className="mt-3 text-gray-500">No projects found</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`${ROUTES.PROJECT.DETAIL}/${item.id}` as any);
            }}
            className="mb-3 rounded-xl bg-white p-4 pt-3 shadow"
          >
            <Text className="font-semibold text-blue-600">{item.code}</Text>
            <Text className="text-gray-800">{item.name}</Text>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-sm text-gray-600">
                Start: {new Date(item.startDate).toLocaleDateString('vi-VN')}
              </Text>
              <Text className="text-sm text-gray-600">
                End: {new Date(item.endDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>

            <View className="mt-2">
              <Text
                className={`self-start rounded-full px-3 py-1 text-xs font-medium ${
                  item.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'Completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          loadingProject ? <ActivityIndicator size="large" style={{ marginVertical: 20 }} /> : null
        }
      />

      {/* Modal hiển thị Performance */}
      <Modal visible={showPerformance} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-black/40 px-5">
          <View className="rounded-2xl bg-white p-5 shadow-lg">
            <Text className="mb-4 text-center text-lg font-bold text-gray-700">
              Performance Overview
            </Text>

            <BarChart
              data={{
                labels: ['Productivity', 'Communication', 'Teamwork', 'Problem Solving'],
                datasets: [
                  {
                    data: [
                      performance?.productivity ?? 0,
                      performance?.communication ?? 0,
                      performance?.teamwork ?? 0,
                      performance?.problemSolving ?? 0,
                    ],
                  },
                ],
              }}
              width={screenWidth - 60}
              height={260}
              fromZero
              showValuesOnTopOfBars={false}
              yAxisLabel=""
              yAxisSuffix=""
              withInnerLines={false}
              chartConfig={{
                backgroundGradientFrom: '#eff6ff', // xanh nhạt (gradient start)
                backgroundGradientTo: '#ffffff', // gradient end
                decimalPlaces: 0,
                barPercentage: 0.6,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // blue-600
                labelColor: () => '#374151',
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#e5e7eb',
                },
                propsForLabels: {
                  fontSize: 9,
                },
              }}
              style={{
                borderRadius: 16,
                paddingRight: 10,
              }}
            />

            <TouchableOpacity
              className="mt-6 rounded-xl bg-blue-500 py-3"
              onPress={() => setShowPerformance(false)}
            >
              <Text className="text-center font-semibold text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
