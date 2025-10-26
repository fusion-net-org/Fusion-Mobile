import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { images } from '../../constants/image/image';
import { ROUTES } from '../../routes/route';
import { loadCompanyFromCache } from '../../src/redux/compnaySlice';
import { RootState } from '../../src/redux/store';
import { fetchUserDetails, updateUserRedux } from '../../src/redux/userSlice';

const AlertHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { user } = useSelector((state: RootState) => state.user);
  const selectedCompany = useSelector((state: RootState) => state.company.selectedCompany);

  const isInCompanyDetail = pathname.includes('/company_detail');

  // 🔹 Load user avatar nếu chưa có
  useEffect(() => {
    const loadUserDetail = async () => {
      if (user?.userId && !user.avatar) {
        const resultAction = await dispatch(fetchUserDetails(user.userId) as any);
        const data = resultAction.payload;
        console.log(data.avatar, data.gender, data.phone, data.address);
        if (data) {
          const updatedUser = {
            ...user,
            avatar: data.avatar,
            gender: data.gender,
            phone: data.phone,
            address: data.address,
          };
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          dispatch(updateUserRedux(updatedUser));
        }
      }
    };
    loadUserDetail();
  }, [user?.userId, user?.avatar]);

  // 🔹 Khi app mở, load company cache 1 lần
  useEffect(() => {
    dispatch(loadCompanyFromCache() as any);
  }, []);

  const handleLogoPress = () => {
    if (isInCompanyDetail && selectedCompany) {
      // Quay về trang chính của công ty
      router.replace(`${ROUTES.COMPANY.DETAIL}/${selectedCompany.id}` as any);
    } else {
      // Khi ở ngoài company_detail thì về trang danh sách công ty
      router.replace(ROUTES.HOME.COMPANY as any);
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center justify-between bg-white px-5 py-3 shadow-sm">
        {/* Company Logo / Name */}
        <TouchableOpacity
          onPress={handleLogoPress}
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          {isInCompanyDetail && selectedCompany ? (
            <>
              {selectedCompany?.avatarCompany ? (
                <Image
                  source={{ uri: selectedCompany.avatarCompany }}
                  className="mr-2 h-8 w-8 rounded-full"
                />
              ) : (
                <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <FontAwesome5 name="user" size={16} color="#000" />
                </View>
              )}
              <Text className="text-lg font-semibold text-gray-800">{selectedCompany?.name}</Text>
            </>
          ) : (
            <Image source={images.logoFusion} className="h-8 w-28" resizeMode="contain" />
          )}
        </TouchableOpacity>

        {/* Avatar user */}
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
    </SafeAreaView>
  );
};

export default AlertHeader;
