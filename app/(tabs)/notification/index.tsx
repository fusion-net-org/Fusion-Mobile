import AlertHeader from '@/components/layouts/alert-header';
import {
  DeleteNotificationById,
  DeleteNotificationsAll,
  GetNotifications,
  MarkAsReadNotification,
} from '@/src/services/notificationService';

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
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

dayjs.extend(relativeTime);

export default function Notification() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: notificationsRaw = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: GetNotifications,
  });

  const notifications = notificationsRaw.filter((x: any) => !x.isDelete);

  const markAsReadMutation = useMutation({
    mutationFn: MarkAsReadNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteNotificationById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteAllMutation = useMutation({
    mutationFn: DeleteNotificationsAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

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

  const renderRightActions = (item: any) => (
    <TouchableOpacity
      className="h-full w-20 items-center justify-center bg-red-500"
      onPress={() => deleteMutation.mutate(item.id)}
    >
      <FontAwesome5 name="trash" size={20} color="#fff" />
      <Text className="text-xs text-white">Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => {
    const isUnread = !item.isRead;
    const time = dayjs(item.createAt).fromNow();

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity
          className={`flex-row items-start border-b border-gray-100 px-4 py-3 ${
            isUnread ? 'bg-blue-50' : 'bg-white'
          }`}
          onPress={() => markAsReadMutation.mutate(item.id)}
          activeOpacity={0.7}
        >
          {/* Icon */}
          <View className="mr-3 rounded-full bg-blue-100 p-3">
            <FontAwesome5
              name={isUnread ? 'bell' : 'check-circle'}
              size={18}
              color={isUnread ? '#007bff' : '#999'}
            />
          </View>

          {/* Nội dung */}
          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${isUnread ? 'text-black' : 'text-gray-500'}`}
            >
              {item.title}
            </Text>
            <Text className="mt-1 text-sm text-gray-600">{item.body}</Text>

            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-xs text-gray-400">{time}</Text>

              {!isUnread && (
                <TouchableOpacity onPress={() => deleteMutation.mutate(item.id)}>
                  <FontAwesome5 name="trash" size={15} color="red" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <>
      <AlertHeader />

      <View className="flex-1 bg-white">
        {/* Header có nút Delete All */}
        <View className="flex-row items-center justify-between border-b border-gray-200 px-5 py-3">
          <Text className="text-xl font-semibold text-gray-800">Notifications</Text>

          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={() => deleteAllMutation.mutate()}
              className="rounded-md bg-red-500 px-3 py-1"
            >
              <Text className="text-sm font-medium text-white">Delete All</Text>
            </TouchableOpacity>
          )}
        </View>

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
