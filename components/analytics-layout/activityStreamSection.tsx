import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

import { UserStore } from '@/interfaces/user';
import { UserLogResponse } from '@/interfaces/user_log';
import { GetUserLogByUserIdAsync } from '@/src/services/userLogService';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import { ChevronRight, User } from 'lucide-react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function ActivityStreamSection() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserStore>();
  const [logs, setLogs] = useState<UserLogResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load currentUserId
  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUserId(user.userId);
        setCurrentUser(user);
      }
    };
    loadUser();
  }, []);

  const fetchLogs = useCallback(async () => {
    if (!currentUserId || loading || !hasMore) return;

    try {
      setLoading(true);

      const filter = {
        pageNumber,
        pageSize,
      };

      const res = await GetUserLogByUserIdAsync(currentUserId, filter);

      if (res.items.length === 0) {
        setHasMore(false);
      } else {
        setLogs((prev: UserLogResponse[]) => {
          return [...prev, ...res.items] as UserLogResponse[];
        });
      }
    } catch (err) {
      console.log('❌ Fetch logs error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, pageNumber, hasMore]);

  useEffect(() => {
    fetchLogs();
  }, [currentUserId, pageNumber]);

  // Group by day
  const groupByDate = logs.reduce((groups: any, log) => {
    const day = format(parseISO(log.createdAt), 'dd MMMM yyyy');
    if (!groups[day]) groups[day] = [];
    groups[day].push(log);
    return groups;
  }, {});

  const sectionList = Object.keys(groupByDate).map((date) => ({
    title: date,
    data: groupByDate[date],
  }));

  const loadMore = () => {
    if (!loading && hasMore) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }: any) => (
    <View className="flex-row px-4 py-3">
      <View className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
        {currentUser?.avatar ? (
          <Image source={{ uri: currentUser.avatar }} className="h-10 w-10" resizeMode="cover" />
        ) : (
          <User size={20} color="white" />
        )}
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold">
          {currentUser?.userName} <Text className="text-gray-600">{item.title}</Text>
        </Text>

        <Text className="mt-1 text-gray-500">{item.description}</Text>

        <View className="mt-1 flex-row items-center">
          <ChevronRight size={16} color="#888" />
          <Text className="ml-1 text-gray-500">{formatLocalDate(item.createdAt)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Loading lần đầu */}
      {sectionList.length === 0 && loading ? (
        <ActivityIndicator className="mt-10" />
      ) : (
        <View className="flex-1 overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* EMPTY STATE */}
          {sectionList.length === 0 && !loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="mb-4 text-5xl">📭</Text>
              <Text className="text-lg font-semibold text-gray-600">No Data Found</Text>
              <Text className="mt-1 text-gray-400">There is nothing to display here.</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={sectionList}
              keyExtractor={(item, index) => `${item.title}-${index}`}
              renderItem={({ item }) => (
                <View>
                  {/* Header date */}
                  <Text className="px-4 py-2 font-semibold text-gray-600">{item.title}</Text>

                  {item.data.map((log: any, index: number) => (
                    <View key={`${log.id}-${index}`}>{renderItem({ item: log })}</View>
                  ))}
                </View>
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={loading ? <ActivityIndicator className="my-4" /> : <View />}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      )}
    </View>
  );
}
