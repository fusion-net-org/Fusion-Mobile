// src/screens/Profile.tsx
import { ProfileTabs } from '@/constants/navigate/tabs';
import { ROUTES } from '@/routes/route';
import { RootState } from '@/src/redux/store';
import { logoutUser } from '@/src/redux/userSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch<any>();
  const { user, loading } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      await AsyncStorage.removeItem('user');

      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'You have been successfully logged out.',
        position: 'top',
        visibilityTime: 2000,
      });
      router.replace(ROUTES.AUTH.LOGIN as any);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'There is error when logout',
        text2: err,
        position: 'top',
      });
    }
  };

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }} className="px-5 pt-6">
      <Image
        source={{ uri: user.avatar || 'https://via.placeholder.com/100' }}
        className="mt-4 h-24 w-24 rounded-full"
      />
      <Text className="mt-3 text-xl font-bold">{user.userName}</Text>
      <Text className="mt-1 text-gray-500">{user.email}</Text>

      <View className="mt-5 w-full pt-5">
        {ProfileTabs.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              if (item.title === 'Log out') handleLogout();
              else {
                router.push(item.path as any);
              }
            }}
            className="flex-row items-center justify-between border-b border-gray-200 py-4"
          >
            <View className="flex-row items-center ps-5">
              {/* Nền tròn bao icon */}
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <FontAwesome5 name={item.icon as any} size={18} color="#5A67D8" />
              </View>

              {/* Tiêu đề */}
              <Text className="ml-4 text-[16px] font-semibold text-gray-800">{item.title}</Text>
            </View>

            {/* Chevron phải */}
            <View className="pe-10">
              <FontAwesome5 name="chevron-right" size={14} color="#A0AEC0" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Profile;
