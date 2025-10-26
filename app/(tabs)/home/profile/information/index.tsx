import { RootState } from '@/src/redux/store';
import { FontAwesome5 } from '@expo/vector-icons';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const ProfileInformation = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} className="px-5 pt-6">
        <Image
          source={{ uri: user.avatar || 'https://via.placeholder.com/100' }}
          className="mt-4 h-24 w-24 rounded-full"
        />
        <Text className="mt-3 text-xl font-bold">{user.userName}</Text>
        <Text className="mt-1 text-gray-500">{user.email}</Text>

        {/* Thông tin cá nhân */}
        <View className="mx-3 mb-6 mt-5 rounded-2xl bg-white p-5 shadow">
          <View className="mb-5 flex-row items-center">
            <FontAwesome5 name="address-card" size={20} color="#4F46E5" />
            <Text className="ml-2 text-lg font-bold text-gray-800">Contact Information</Text>
          </View>

          {/* Email */}
          <View className="mb-4 w-[95%] flex-row items-center self-center rounded-xl bg-indigo-50 p-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-indigo-100">
              <FontAwesome5 name="envelope" size={18} color="#4F46E5" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold text-gray-700">Email</Text>
              <Text className="text-sm text-gray-600">{user.email}</Text>
            </View>
          </View>

          {/* Phone */}
          <View className="mb-4 w-[95%] flex-row items-center self-center rounded-xl bg-green-50 p-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-green-100">
              <FontAwesome5 name="phone" size={18} color="#16A34A" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold text-gray-700">Phone number</Text>
              <Text className="text-sm text-gray-600">{user.phone || '—'}</Text>
            </View>
          </View>

          {/* Address */}
          <View className="mb-4 w-[95%] flex-row items-center self-center rounded-xl bg-pink-50 p-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-pink-100">
              <FontAwesome5 name="map-marker-alt" size={18} color="#DB2777" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold text-gray-700">Address</Text>
              <Text className="text-sm text-gray-600">{user.address || '—'}</Text>
            </View>
          </View>

          {/* Gender */}
          <View className="w-[95%] flex-row items-center self-center rounded-xl bg-rose-50 p-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-rose-100">
              <FontAwesome5 name="user" size={18} color="#E11D48" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold text-gray-700">Gender</Text>
              <Text className="text-sm text-gray-600">{user.gender || '—'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileInformation;
