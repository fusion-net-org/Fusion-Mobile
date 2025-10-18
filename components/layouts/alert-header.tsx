import { FontAwesome5 } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { images } from '../../constants/image/image';
import { ROUTES } from '../../routes/route';
import { clearSelectedCompany, loadCompanyFromCache } from '../../src/redux/compnaySlice';
import { RootState } from '../../src/redux/store';
import { fetchUserDetails } from '../../src/redux/userSlice';

const AlertHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { user } = useSelector((state: RootState) => state.user);
  const selectedCompany = useSelector((state: RootState) => state.company.selectedCompany);

  const isInCompanyDetail = pathname.includes('/company_detail');

  // 🔹 Load user avatar nếu chưa có
  useEffect(() => {
    if (user?.userId && !user.avatar) {
      dispatch(fetchUserDetails(user.userId) as any);
    }
  }, [user?.userId, user?.avatar]);

  // 🔹 Khi app mở, load company cache 1 lần
  useEffect(() => {
    dispatch(loadCompanyFromCache() as any);
  }, []);

  const handleLogoPress = () => {
    if (isInCompanyDetail) {
      dispatch(clearSelectedCompany());
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
