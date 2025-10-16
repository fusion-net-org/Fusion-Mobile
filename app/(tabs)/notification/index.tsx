import AlertHeader from '@/components/layouts/alert-header';
import { GetNotifications, MarkAsReadNotification } from '@/src/services/notificationService';
import { FontAwesome5 } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

dayjs.extend(relativeTime);

export default function Notification() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Fetch danh sách noti
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: GetNotifications,
  });

  // 🔹 Mutation đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: MarkAsReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 🔹 Kéo để refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    setRefreshing(false);
  }, [queryClient]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#333" />
        <Text className="mt-3 text-gray-500">Loading Notifications...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    const isUnread = !item.isRead;
    const time = item.createAt ? dayjs(item.createAt).fromNow() : 'Unknown time';

    return (
      <TouchableOpacity
        className={`flex-row items-start border-b border-gray-100 px-4 py-3 ${
          isUnread ? 'bg-blue-50' : 'bg-white'
        }`}
        onPress={() => markAsReadMutation.mutate(item.id)}
        activeOpacity={0.7}
      >
        {/* Icon bên trái */}
        <View className="mr-3 rounded-full bg-blue-100 p-3">
          <FontAwesome5
            name={isUnread ? 'bell' : 'check-circle'}
            size={18}
            color={isUnread ? '#007bff' : '#999'}
          />
        </View>

        {/* Nội dung chính */}
        <View className="flex-1">
          <Text className={`text-base font-semibold ${isUnread ? 'text-black' : 'text-gray-500'}`}>
            {item.title || 'No title'}
          </Text>
          <Text className="mt-1 text-sm text-gray-600">{item.body || 'No message'}</Text>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-xs text-gray-400">{time}</Text>

            {item.readAt ? (
              <Text className="text-xs text-green-500">
                Read: {dayjs(item.readAt).format('HH:mm DD/MM')}
              </Text>
            ) : (
              <Text className="text-xs text-blue-500">Unread</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AlertHeader />
      <View className="flex-1 bg-white ">
        {/* Header */}
        {/* <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-5">
          <Text className="text-2xl font-semibold text-gray-800">Notifications</Text>
        </View> */}

        {/* List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <FontAwesome5 name="bell-slash" size={40} color="#ccc" />
              <Text className="mt-3 text-gray-400">There is no notifications</Text>
            </View>
          }
        />
      </View>
    </>
  );
}
