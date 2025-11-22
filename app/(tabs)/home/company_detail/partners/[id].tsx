import PartnerFilterSection from '@/components/partner-layout/partnerfiltersection';
import { emptyImages } from '@/constants/image/image';
import { ROUTES } from '@/routes/route';
import {
  fetchPartnerStatusSummaryThunk,
  fetchPartnersThunk,
  resetPartners,
  updatePartnerFilter,
} from '@/src/redux/partnerSlice';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { router, useLocalSearchParams } from 'expo-router';
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

const Partners = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companyId = id;
  const { data, loading, filter, statusSummary } = useAppSelector((state) => state.partner);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (companyId) {
      dispatch(fetchPartnersThunk({ companyId, filter }));
      dispatch(fetchPartnerStatusSummaryThunk(companyId));
    }
  }, [companyId, filter, dispatch]);

  const handleFilterChange = (newFilter: any) => {
    const updatedFilter = { ...filter, ...newFilter, pageNumber: 1 };

    // Reset danh sách trước khi load mới
    dispatch(resetPartners());
    dispatch(updatePartnerFilter(updatedFilter));

    console.log('From', updatedFilter.fromDate);

    if (companyId) {
      dispatch(fetchPartnersThunk({ companyId, filter: updatedFilter }));
    }
  };

  const handlePartnerPress = (partnerId: string) => {
    router.push(`${ROUTES.PARTNER.DETAIL}/${partnerId}` as any);
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
      <PartnerFilterSection onFilterChange={handleFilterChange} />

      {/* Table */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" className="mt-10" />
      ) : data.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Image
            source={emptyImages.emptyPartner}
            className="mb-4 h-48 w-48"
            resizeMode="contain"
          />
          <Text className="text-base text-gray-400">No partners found</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="min-w-[700px] flex-1">
            <FlatList
              contentContainerStyle={{ paddingBottom: 40 }}
              data={data}
              keyExtractor={(item) => item.companyId.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View className=" flex-row items-center border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <Text className="w-[35%] text-sm font-semibold text-gray-600">Business name</Text>
                  <Text className="w-[25%] text-sm font-semibold text-gray-600">Owner</Text>
                  <Text className="w-[25%] text-sm font-semibold text-gray-600">Date</Text>
                  <Text className="w-[15%] text-center text-sm font-semibold text-gray-600">
                    Projects
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handlePartnerPress(item.companyId)}
                  activeOpacity={0.7}
                  className="flex-row items-center border-b border-gray-100 bg-white px-4 py-4"
                >
                  <View className="flex-row items-center border-b border-gray-100 bg-white px-4 py-4">
                    {/* Business name + Code */}
                    <View className="w-[35%]">
                      <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500" numberOfLines={1}>
                        Code: {item.taxCode || `C${item.companyId}`}
                      </Text>
                    </View>

                    {/* Owner */}
                    <View className="w-[25%]">
                      <Text className="font-medium text-gray-800" numberOfLines={1}>
                        {item.ownerUserName || '—'}
                      </Text>
                      <Text className="text-sm text-gray-500">Owner</Text>
                    </View>

                    {/* Date */}
                    <View className="w-[25%] items-start">
                      <Text className="font-medium text-gray-800">
                        Since: {item.createdAt?.split('T')[0] || '—'}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Responded: {item.respondedAt ? item.respondedAt.split('T')[0] : '-'}
                      </Text>
                    </View>

                    {/* Projects */}
                    <View className="w-[15%] items-center">
                      <Text className=" font-semibold text-gray-800">{item.totalProject || 0}</Text>
                      <Text className="text-sm text-gray-500">Projects</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Partners;
