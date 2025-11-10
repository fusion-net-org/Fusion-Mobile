import { ILogActivity } from '@/interfaces/log_activity';
import { AllActivityLogCompanyById } from '@/src/services/companyServices';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';

interface ActivitySectionProps {
  companyId: string;
}

const pageSize = 25;

const ActivitySection: React.FC<ActivitySectionProps> = ({ companyId }) => {
  const [logs, setLogs] = useState<ILogActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [activityForbidden, setActivityForbidden] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async (page = 1, keyword = '') => {
    try {
      setLoading(true);

      const res = await AllActivityLogCompanyById(
        companyId,
        keyword === '' ? null : keyword,
        null,
        null,
        page,
        pageSize,
      );

      if (res?.succeeded && Array.isArray(res?.data?.items)) {
        if (page === 1) {
          setLogs(res.data.items);
        } else {
          setLogs((prev) => [...prev, ...res.data.items]);
        }
        setTotalCount(res.data.totalCount || 0);
      } else {
        if (page === 1) setLogs([]);
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setActivityForbidden(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(1, searchTerm);
  }, [companyId, searchTerm]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchLogs(currentPage, searchTerm);
    }
  }, [currentPage]);

  const handleScroll = (e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;

    const bottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 60;

    if (bottom && !loading && logs.length < totalCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderItem = (item: ILogActivity, index: number) => (
    <View key={item.id || index} className="mb-6 flex-row">
      <View className="items-center">
        <View className="h-3 w-3 rounded-full bg-blue-600" />
        {index < logs.length - 1 && <View className="mt-1 w-0.5 flex-1 bg-blue-300" />}
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-xs text-gray-500">
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </Text>
        <Text className="font-semibold text-gray-800">{item.title}</Text>
        <Text className="text-sm text-gray-600">{item.description}</Text>
      </View>
    </View>
  );

  if (activityForbidden) {
    return (
      <View className="items-center justify-center px-4 py-10">
        <Text className="mb-2 font-medium text-red-600">No permission to view activity logs</Text>
        <Text className="text-center text-sm text-gray-400">
          Please contact the company administrator for access
        </Text>
      </View>
    );
  }

  return (
    <View className="p-4 pb-24">
      <TextInput
        placeholder="Search Activity..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-2"
      />

      {loading && logs.length === 0 ? (
        <ActivityIndicator size="large" color="#2563EB" className="my-10" />
      ) : logs.length === 0 ? (
        <View className="items-center py-10">
          <Text className="text-gray-500">No Activity Found</Text>
          <Text className="text-sm text-gray-400">Try adjusting your search keyword</Text>
        </View>
      ) : (
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
          {logs.map(renderItem)}

          {loading && <ActivityIndicator size="small" color="#2563EB" className="mb-8 mt-4" />}
        </ScrollView>
      )}
    </View>
  );
};

export default ActivitySection;
