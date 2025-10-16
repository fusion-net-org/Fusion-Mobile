import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { notifications } from '../../constants/data/notification';
import { images } from '../../constants/image/image';
import { ROUTES } from '../../routes/route';
import { RootState } from '../../src/redux/store';
import { fetchUserDetails } from '../../src/redux/userSlice';

const AlertHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, []);

  // Gọi API lấy thông tin user chi tiết khi component mount
  useEffect(() => {
    if (user?.userId && !user.avatar) {
      dispatch(fetchUserDetails(user.userId) as any);
    }
  }, [user?.userId, user?.avatar, dispatch]);

  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center justify-between bg-white px-5 py-3 shadow-sm">
        <TouchableOpacity
          onPress={() => router.push(ROUTES.HOME.COMPANY as any)} // 👈 nhảy về trang home
          activeOpacity={0.7}
        >
          <Image source={images.logoFusion} className="h-8 w-28" resizeMode="contain" />
        </TouchableOpacity>

        {/* User Info + Notification + Avatar */}
        <View className="flex-row items-center gap-3">
          {/* Notification */}
          <TouchableOpacity
            onPress={() => router.push(ROUTES.HOME.NOTIFICATION as any)}
            activeOpacity={0.7}
            className="relative"
          >
            <View className="rounded-full bg-gray-100 p-2">
              <FontAwesome5 name="bell" size={20} color="#333" />
            </View>

            {/* 🔴 Hiển thị số lượng chưa đọc */}
            {unreadCount > 0 && (
              <View className="absolute -right-1 -top-1 min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1">
                <Text className="text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Avatar → Account */}
          <TouchableOpacity
            onPress={() => router.push(ROUTES.ACCOUNT.INDEX as any)}
            activeOpacity={0.7}
          >
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="h-10 w-10 rounded-full border border-gray-200"
              />
            ) : (
              <View className="h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                <FontAwesome5 name="user" size={20} color="#000000" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AlertHeader;
