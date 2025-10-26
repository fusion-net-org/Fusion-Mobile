import { RootState, useAppDispatch } from '@/src/redux/store';
import { updateUserThunk } from '@/src/redux/userSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

const ProfileInformation = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || '',
  });

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery was denied');
      return;
    }

    // Dùng API mới
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      // ⚙️ Tạo formData để gửi API
      const data = new FormData();

      if (avatar && avatar !== user.avatar) {
        data.append('avatar', {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);
      }

      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('gender', formData.gender);

      console.log('Submit data:', formData);
      console.log('Avatar file:', avatar);

      // TODO: gọi API update
      const result = await dispatch(updateUserThunk(data));

      if (updateUserThunk.fulfilled.match(result)) {
        Toast.show({
          type: 'success',
          text1: 'Thành công 🎉',
          text2: 'Cập nhật thông tin cá nhân thành công!',
        });
        setIsEditing(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Thất bại ❌',
          text2:
            typeof result.payload === 'string'
              ? result.payload
              : 'Cập nhật thất bại, vui lòng thử lại.',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi hệ thống ⚠️',
        text2: 'Có lỗi không xác định khi cập nhật.',
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }}
      className="bg-gray-50 px-5 pt-6"
    >
      {/* Avatar + Edit button */}
      <View className="relative mt-4">
        <Image
          source={{ uri: avatar || 'https://via.placeholder.com/150' }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60, // ✅ hình tròn
            borderWidth: 3,
            borderColor: '#3B82F6',
          }}
        />
        {isEditing && (
          <TouchableOpacity
            onPress={handlePickImage}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#3B82F6',
              borderRadius: 20,
              padding: 6,
              borderWidth: 2,
              borderColor: '#fff',
            }}
          >
            <FontAwesome5 name="pen" size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tên user */}
      <Text className="mt-3 text-xl font-bold">{user.userName}</Text>
      <Text className="mt-1 text-gray-500">{user.email}</Text>

      {/* --- Edit / Save button --- */}
      <TouchableOpacity
        onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        className={`mt-4 rounded-lg ${isEditing ? 'bg-green-500' : 'bg-blue-500'} px-5 py-2`}
      >
        <Text className="text-base font-semibold text-white">{isEditing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>

      {/* --- Editable fields --- */}
      <View className="mx-3 mb-6 mt-5 w-full rounded-2xl bg-white p-5 shadow">
        {/* Phone */}
        <View className="mb-4 flex-row items-center">
          <FontAwesome5 name="phone" size={18} color="#16A34A" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-gray-700">Phone</Text>
            {isEditing ? (
              <TextInput
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                className="mt-1 rounded-lg border border-gray-300 px-2 py-1 text-gray-700"
                keyboardType="phone-pad"
              />
            ) : (
              <Text className="text-sm text-gray-600">{formData.phone || '—'}</Text>
            )}
          </View>
        </View>

        {/* Address */}
        <View className="mb-4 flex-row items-center">
          <FontAwesome5 name="map-marker-alt" size={18} color="#DB2777" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-gray-700">Address</Text>
            {isEditing ? (
              <TextInput
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
                className="mt-1 rounded-lg border border-gray-300 px-2 py-1 text-gray-700"
              />
            ) : (
              <Text className="text-sm text-gray-600">{formData.address || '—'}</Text>
            )}
          </View>
        </View>

        {/* Gender */}
        <View className="flex-row items-center">
          <FontAwesome5 name="user" size={18} color="#E11D48" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-gray-700">Gender</Text>
            {isEditing ? (
              <View className="mt-2 flex-row gap-4">
                {['Nam', 'Nữ'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => handleChange('gender', g)}
                    className={`rounded-full px-4 py-2 ${
                      formData.gender === g ? 'bg-rose-500' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        formData.gender === g ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-gray-600">{formData.gender || '—'}</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileInformation;
