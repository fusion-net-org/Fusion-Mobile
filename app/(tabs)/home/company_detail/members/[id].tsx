import MemberFilterSection from '@/components/member-layout/memberfiltersection';
import { emptyImages } from '@/constants/image/image';
import { ROUTES } from '@/routes/route';
import { fetchMembersThunk, resetMembers, updateMemberFilter } from '@/src/redux/memberSlice';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

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
    if (loading || data.length >= (statusSummary?.total ?? 0)) return;

    const nextPage = filter.pageNumber + 1;
    const updatedFilter = { ...filter, pageNumber: nextPage };

    dispatch(updateMemberFilter(updatedFilter));
    dispatch(fetchMembersThunk({ companyId, filter: updatedFilter }));
  };
  const handleMemberPress = (memberId: string) => {
    router.push({
      pathname: `${ROUTES.MEMBER.DETAIL}/${memberId}` as any,
      params: {
        id: memberId,
        companyId: companyId,
      },
    });
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
        <FlatList
          data={data}
          keyExtractor={(item) => item.memberId.toString()}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={
            loading && filter.pageNumber > 1 ? (
              <ActivityIndicator size="small" color="#007bff" className="my-4" />
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleMemberPress(item.memberId)}
              activeOpacity={0.85}
              className="mb-4 mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              {/* Header */}
              <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center">
                  <Text className="mr-2 text-base font-semibold text-gray-800" numberOfLines={1}>
                    {item.memberName}
                  </Text>

                  {item.isOwner === 'true' && (
                    <View className="flex-row items-center rounded border border-orange-500 bg-orange-50 px-2 py-0.5">
                      <FontAwesome5 name="crown" size={12} color="#f97316" />
                      <Text className="ml-1 text-xs font-medium text-orange-500">OWNER</Text>
                    </View>
                  )}
                </View>

                <Text
                  className={`font-semibold
              ${item.status === 'Active' ? 'text-green-500' : ''}
              ${item.status === 'Inactive' ? 'text-red-500' : ''}
              ${item.status === 'Pending' ? 'text-yellow-500' : ''}
            `}
                >
                  {item.status || 'N/A'}
                </Text>
              </View>

              {/* Divider */}
              <View className="my-3 h-px bg-gray-100" />

              {/* Phone */}
              <View className="mb-1 flex-row">
                <Text className="w-24 text-sm text-gray-500">Phone</Text>
                <Text className="text-sm font-medium text-gray-800">
                  {item.memberPhoneNumber || '—'}
                </Text>
              </View>

              {/* Role */}
              <View className="mb-1 flex-row">
                <Text className="w-24 text-sm text-gray-500">Role</Text>
                <Text className="text-sm font-medium text-gray-800">{item.roleName || '—'}</Text>
              </View>

              {/* Joined At */}
              <View className="flex-row">
                <Text className="w-24 text-sm text-gray-500">Joined At</Text>
                <Text className="text-sm text-gray-700">
                  {item.joinedAt ? item.joinedAt.split('T')[0] : '-'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Members;
