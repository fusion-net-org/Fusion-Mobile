import { emptyImages } from '@/constants/image/image';
import { ProjectRequest, ProjectRequestFilter } from '@/interfaces/project_request';
import { ROUTES } from '@/routes/route';
import {
  fetchProjectRequestPaged,
  resetProjectRequest,
  setFilter,
} from '@/src/redux/projectRequestSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/src/redux/store';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import '../../app/globals.css';
import ProjectRequestFilterSection from '../project-request-layout/ProjectRequestFilterSection';

interface Props {
  partnerId: string; //bắt buộc có
}

const ProjectRequestSection = ({ partnerId }: Props) => {
  const dispatch = useAppDispatch();
  const { data, filter, loading, totalCount } = useAppSelector(
    (state: RootState) => state.projectRequest,
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  // Lấy công ty hiện tại
  useEffect(() => {
    const fetchCompany = async () => {
      const storedCompany = await AsyncStorage.getItem('selectedCompany');
      if (storedCompany) {
        const company = JSON.parse(storedCompany);
        setSelectedCompanyId(company.id);
      }
    };
    fetchCompany();
  }, []);

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    if (!partnerId || !selectedCompanyId) return;
    const fullFilter: ProjectRequestFilter = { ...filter, partnerId };
    dispatch(
      fetchProjectRequestPaged({ filter: fullFilter, companyId: selectedCompanyId! }),
    ).unwrap();
  }, [partnerId, selectedCompanyId]);

  // Load thêm khi scroll cuối
  const handleLoadMore = () => {
    if (loading || data.length >= totalCount || !selectedCompanyId) return;
    const nextPage = filter.pageNumber + 1;
    const nextFilter = { ...filter, partnerId, pageNumber: nextPage };
    dispatch(setFilter({ pageNumber: nextPage }));
    dispatch(fetchProjectRequestPaged({ filter: nextFilter, companyId: selectedCompanyId }));
  };

  // Khi thay đổi filter từ filter section
  const handleFilterChange = (newFilter: Partial<ProjectRequestFilter>) => {
    if (!partnerId || !selectedCompanyId) return;
    dispatch(resetProjectRequest());
    const merged = { ...filter, ...newFilter, partnerId, pageNumber: 1 };
    dispatch(setFilter(merged));
    dispatch(fetchProjectRequestPaged({ filter: merged, companyId: selectedCompanyId }));
  };

  useFocusEffect(
    useCallback(() => {
      // Khi tab focus
      if (partnerId && selectedCompanyId) {
        const fullFilter: ProjectRequestFilter = { ...filter, partnerId };
        dispatch(
          fetchProjectRequestPaged({ filter: fullFilter, companyId: selectedCompanyId! }),
        ).unwrap();
      }

      return () => {
        // Khi tab mất focus
        dispatch(resetProjectRequest());
      };
    }, [partnerId, selectedCompanyId]),
  );

  // Render từng request
  const renderRequest = ({ item }: { item: ProjectRequest }) => {
    // Xác định vai trò của công ty hiện tại
    const side =
      selectedCompanyId === item.requesterCompanyId
        ? 'Requester'
        : selectedCompanyId === item.executorCompanyId
          ? 'Executor'
          : 'Unknown';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (!item.convertedProjectId) {
            Toast.show({
              type: 'error',
              text1: 'Project does not exist',
              position: 'top',
              visibilityTime: 1500,
            });
            return;
          }

          router.push({
            pathname: `${ROUTES.PROJECT.REQUEST}/${item.convertedProjectId}` as any,
            params: {
              projectId: item.convertedProjectId,
            },
          });
        }}
      >
        <View className="mx-4 mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          {/* Header */}
          <View className="mb-2 flex-row justify-between">
            <Text className="font-semibold text-gray-800">
              {item.projectName || 'Unnamed Project'}
            </Text>
            <Text className="text-sm text-gray-500">{formatLocalDate(item.updateAt)}</Text>
          </View>

          {/* Project name */}
          <Text className="mb-2 text-sm text-gray-700" numberOfLines={1}>
            {item.code || 'PRQ-XXX'}
          </Text>

          {/* Side + Status */}
          <View className="flex-row justify-between">
            {/* Side */}
            <View
              className={`rounded-full px-3 py-1 ${
                side === 'Executor'
                  ? 'bg-blue-50'
                  : side === 'Requester'
                    ? 'bg-green-50'
                    : 'bg-gray-50'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  side === 'Executor'
                    ? 'text-blue-600'
                    : side === 'Requester'
                      ? 'text-green-600'
                      : 'text-gray-400'
                }`}
              >
                {side}
              </Text>
            </View>

            {/* Status */}
            <View
              className={`rounded-full border px-3 py-1
                ${item.status === 'Accepted' ? 'border-green-500' : ''}
                ${item.status === 'Rejected' ? 'border-red-500' : ''}
                ${item.status === 'Pending' ? 'border-yellow-500' : ''}
                ${!['Active', 'Inactive', 'Pending'].includes(item.status) ? 'border-gray-400' : ''}`}
            >
              <Text
                className={`
                  text-xs font-medium
                  ${item.status === 'Accepted' ? 'text-green-500' : ''}
                  ${item.status === 'Rejected' ? 'text-red-500' : ''}
                  ${item.status === 'Pending' ? 'text-yellow-500' : ''}
                  ${!['Active', 'Inactive', 'Pending'].includes(item.status) ? 'text-gray-500' : ''}`}
              >
                {item.status || 'Unknown'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar hidden />
      <View className="flex-1 bg-gray-50 pt-3">
        {/* 🏷 Header */}
        <View className="mb-2 px-4">
          <Text className="text-lg font-semibold text-gray-800">Project Request List</Text>
          <Text className="text-sm text-gray-400">Between you and partner</Text>
        </View>

        {/* Filter */}
        <View className="mx-4 mb-3">
          <ProjectRequestFilterSection onFilterChange={handleFilterChange} />
        </View>

        {/* List*/}
        {loading && data.length === 0 ? (
          <ActivityIndicator size="large" color="#007bff" className="mt-10" />
        ) : data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Image
              source={emptyImages.emptyCompany}
              className="mb-4 h-48 w-48"
              resizeMode="contain"
            />
            <Text className="text-base text-gray-400">No project requests found</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderRequest}
            keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            scrollEnabled={false}
            ListFooterComponent={
              loading ? (
                <View className="py-3">
                  <Text className="text-center text-gray-500">Loading more...</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </>
  );
};

export default ProjectRequestSection;
