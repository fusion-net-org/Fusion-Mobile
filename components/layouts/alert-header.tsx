import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { images } from '../../constants/image/image';
import { ROUTES } from '../../routes/route';
import { RootState } from '../../src/redux/store';
import { fetchUserDetails } from '../../src/redux/userSlice';

const AlertHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
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

        {/* User Info + Avatar */}
        <View className="flex-row items-center gap-3">
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
