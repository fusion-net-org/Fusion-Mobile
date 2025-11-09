import MemberFilterSection from '@/components/member-layout/memberfiltersection';
import { emptyImages } from '@/constants/image/image';
import { ROUTES } from '@/routes/route';
import { fetchMembersThunk, resetMembers, updateMemberFilter } from '@/src/redux/memberSlice';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Members = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companyId = id;
  const navigation = useNavigation();
  const { data, loading, filter, statusSummary } = useAppSelector((state) => state.member);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (companyId) {
      dispatch(fetchMembersThunk({ companyId, filter }));
      //dispatch(fetchPartnerStatusSummaryThunk(companyId));
    }
  }, [companyId, filter, dispatch]);

  const handleFilterChange = (newFilter: any) => {
    const updatedFilter = { ...filter, ...newFilter, pageNumber: 1 };
    dispatch(resetMembers());
    dispatch(updateMemberFilter(updatedFilter));

    if (companyId) {
      dispatch(fetchMembersThunk({ companyId, filter: updatedFilter }));
    }
  };

  const handleLoadMore = () => {
    // Nếu đang loading hoặc đã tải hết thì không gọi thêm
    if (loading || data.length >= (statusSummary?.total ?? 0)) return;

    const nextPage = filter.pageNumber + 1;
    const updatedFilter = { ...filter, pageNumber: nextPage };

    dispatch(updateMemberFilter(updatedFilter));
    dispatch(fetchMembersThunk({ companyId, filter: updatedFilter }));
  };
  const handleMemberPress = (memberId: string) => {
    console.log('===== HANDLE MEMBER PRESS =====');
    router.push({
      pathname: `${ROUTES.MEMBER.DETAIL}/${memberId}` as any,
      params: {
        id: memberId,
        companyId: companyId,
      },
    });
    //console.log(`${ROUTES.PARTNER.DETAIL}/${partnerId}`);
    // router.push(`${ROUTES.PARTNER.DETAIL}/${partnerId}` as any);
  };

  return (
    <View className="flex-1 bg-gray-50 pt-3">
      {/* Summary */}
      <View className="mx-4 mt-2 flex-row flex-wrap justify-between">
        <View className="mb-2 rounded-full bg-green-100 px-3 py-1">
          <Text className="font-semibold text-green-700">Active: {statusSummary?.active ?? 0}</Text>
        </View>
        <View className="mb-2 rounded-full bg-yellow-100 px-3 py-1">
          <Text className="font-semibold text-yellow-700">
            Pending: {statusSummary?.pending ?? 0}
          </Text>
        </View>
        <View className="mb-2 rounded-full bg-red-100 px-3 py-1">
          <Text className="font-semibold text-red-700">
            Inactive: {statusSummary?.inactive ?? 0}
          </Text>
        </View>
        <View className="mb-2 rounded-full bg-purple-100 px-3 py-1">
          <Text className="font-semibold text-purple-700">Total: {statusSummary?.total ?? 0}</Text>
        </View>
      </View>

      <Text className="mx-4 mb-3 text-sm text-gray-500">
        Connect businesses to open project rights and share personnel
      </Text>

      {/* Filter Section */}
      <MemberFilterSection onFilterChange={handleFilterChange} />

      {/* Table */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" className="mt-10" />
      ) : data.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Image source={emptyImages.emptyMember} className="mb-4 h-48 w-48" resizeMode="contain" />
          <Text className="text-base text-gray-400">No Members found</Text>
        </View>
      ) : (
        <View className="pt-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[700px] flex-1">
              <FlatList
                contentContainerStyle={{ paddingBottom: 40 }}
                data={data}
                keyExtractor={(item) => item.memberId.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View className="flex-row items-center border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <Text className="w-[35%] text-sm font-semibold text-gray-600">Name</Text>
                    <Text className="w-[25%] text-sm font-semibold text-gray-600">Phone</Text>
                    <Text className="w-[25%] text-sm font-semibold text-gray-600">Join</Text>
                    <Text className="w-[15%] text-center text-sm font-semibold text-gray-600">
                      Status
                    </Text>
                  </View>
                }
                ListFooterComponent={
                  loading && filter.pageNumber > 1 ? (
                    <ActivityIndicator size="small" color="#007bff" className="my-4" />
                  ) : null
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleMemberPress(item.memberId)}
                    activeOpacity={0.7}
                    className="flex-row items-center border-b border-gray-100 bg-white px-4 py-4"
                  >
                    {/* Name */}
                    <View className="w-[35%] flex-row items-center">
                      <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
                        {item.memberName}
                      </Text>
                      {item.isOwner === 'true' && (
                        <View className="ml-2 flex-row items-center rounded border border-orange-500 bg-orange-50 px-2 py-0.5">
                          <FontAwesome5 name="crown" size={12} color="#f97316" className="mr-1" />
                          <Text className="text-xs font-medium text-orange-500">OWNER</Text>
                        </View>
                      )}
                    </View>

                    {/* Phone */}
                    <View className="w-[25%]">
                      <Text className="font-medium text-gray-800" numberOfLines={1}>
                        {item.memberPhoneNumber || '—'}
                      </Text>
                    </View>

                    {/* Join date */}
                    <View className="w-[25%]">
                      <Text className="text-sm text-gray-500">
                        Joined At: {item.joinedAt ? item.joinedAt.split('T')[0] : '-'}
                      </Text>
                    </View>

                    {/* Status */}
                    <View className="w-[15%] items-center">
                      <Text
                        className={`font-semibold
            ${item.status === 'Active' ? 'text-green-500' : ''}
            ${item.status === 'Inactive' ? 'text-red-500' : ''}
            ${item.status === 'Pending' ? 'text-yellow-500' : ''}
            ${!['Active', 'Inactive', 'Pending'].includes(item.status) ? 'text-gray-500' : ''}`}
                      >
                        {item.status || 'N/A'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Members;
