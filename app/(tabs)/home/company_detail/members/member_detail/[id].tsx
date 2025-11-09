import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { GetCompanyMemberByCompanyIdAndUserId } from '@/src/services/memberService';
import { getProjectMemberByCompanyIdAndUserId } from '@/src/services/projectMemberService';
import { getUserById } from '@/src/services/userService';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useLocalSearchParams } from 'expo-router';

export default function MemberDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: userId, companyId } = useLocalSearchParams<{
    id: string;
    companyId: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);

  const [infoHeight, setInfoHeight] = useState(1); // 0 → ẩn, 1 → đầy đủ
  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const tabBarHeight = useBottomTabBarHeight();
  const [search, setSearch] = useState('');

  const MAX_CARD_HEIGHT = 500;

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
      setMember(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoadingProject(true);
      const res = await getProjectMemberByCompanyIdAndUserId(companyId, userId, search);
      const companyData = res.data.items[0]; // lấy object đầu tiên
      setProjects(companyData.projects);
      setProjectCount(companyData.totalProject);
    } catch (err) {
      console.log(err);
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
      {/* Slider luôn nằm trên */}
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
      </View>

      {/* User Card */}
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
            <Text className="flex flex-row items-center text-gray-700">
              <Mail size={16} /> {user?.email}
            </Text>

            <Text className="flex flex-row items-center pt-3 text-gray-700">
              <Phone size={16} /> {user?.phone}
            </Text>

            <Text className="flex flex-row items-center pt-3 text-gray-700">
              <Calendar size={16} /> Joined:{' '}
              {member?.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : '--'}
            </Text>
          </View>

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

          <View className="mt-5 w-full flex-row gap-2">
            {/* Message Button */}
            <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-xl bg-gray-200 p-3">
              <MessageSquare size={18} />
              <Text className="ml-2 font-semibold">Message</Text>
            </TouchableOpacity>

            {/* Performance Overview Button */}
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center rounded-xl bg-blue-500"
              style={{ minHeight: 48 }}
              onPress={() => {
                // handle navigation or show overview
                console.log('Show Performance Overview');
              }}
            >
              <Clock size={18} color="white" />
              <Text className="ml-2 text-sm font-semibold text-white">Performance Overview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search */}
      <View className="mx-4 mt-5 flex-row items-center rounded-xl bg-white p-3">
        <Search size={18} color="gray" />
        <TextInput
          placeholder="Search project..."
          className="ml-2 flex-1"
          onChangeText={setSearch}
        />
      </View>

      {/* Project List */}
      {loadingProject ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          className="mt-4"
          data={projects}
          contentContainerStyle={{
            paddingBottom: tabBarHeight + 20,
            paddingHorizontal: 16,
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity className="mb-3 rounded-xl bg-white p-4 shadow">
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
        />
      )}
    </View>
  );
}
