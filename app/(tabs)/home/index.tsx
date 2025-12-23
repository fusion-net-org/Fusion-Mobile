import FilterSection from '@/components/company-layout/filtersection';
import AlertHeader from '@/components/layouts/alert-header';
import { emptyImages } from '@/constants/image/image';
import { UserStore } from '@/interfaces/user';
import { ROUTES } from '@/routes/route';
import {
  fetchCompaniesThunk,
  resetCompanies,
  setSelectedCompany,
  updateFilter,
} from '@/src/redux/compnaySlice';
import { RootState, useAppDispatch, useAppSelector } from '@/src/redux/store';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import '../../globals.css';

const Home = () => {
  const dispatch = useAppDispatch();
  const { data, filter, loading, totalCount } = useAppSelector((state: RootState) => state.company);
  const [search, setSearch] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserStore>();

  useEffect(() => {
    dispatch(fetchCompaniesThunk(filter));
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(resetCompanies()); // reset lại list
      dispatch(updateFilter({ keyword: search, pageNumber: 1 }));
      dispatch(fetchCompaniesThunk({ keyword: search, pageNumber: 1 }));
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

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

  const handleLoadMore = () => {
    if (!loading && data.length < totalCount) {
      const nextPage = filter.pageNumber + 1;
      dispatch(fetchCompaniesThunk({ pageNumber: nextPage }));
    }
  };

  const renderCompany = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={async () => {
        dispatch(setSelectedCompany(item));
        await AsyncStorage.setItem('selectedCompany', JSON.stringify(item));
        router.push(`${ROUTES.COMPANY.DETAIL}/${item.id}` as any);
      }}
    >
      <View className="mx-4 mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <View className="relative mb-3">
          <Image
            source={{ uri: item.imageCompany }}
            className="h-40 w-full rounded-xl"
            resizeMode="cover"
          />

          {currentUser &&
            (item.ownerUserId === currentUserId ? (
              <View className="absolute right-2 top-2 rounded-full border border-green-300 bg-green-50 px-2 py-[2px]">
                <Text className="text-[9px] font-semibold text-green-700">OWNER</Text>
              </View>
            ) : (
              <View className="absolute right-2 top-2 rounded-full bg-purple-600 px-2 py-[2px]">
                <Text className="text-[9px] font-semibold text-white">MEMBER</Text>
              </View>
            ))}
        </View>

        <View className="mb-1 flex-row items-center">
          <Image source={{ uri: item.avatarCompany }} className="mr-2 h-8 w-8 rounded-full" />
          <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        </View>
        <Text className="mb-2 text-sm text-gray-400">{item.detail}</Text>

        <View className="mb-2 flex-row justify-between">
          <View className="flex-row items-center">
            <FontAwesome5 name="users" size={14} color="#555" />
            <Text className="ml-1 text-sm text-gray-600">{item.totalMember} Members</Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesome5 name="folder" size={14} color="#555" />
            <Text className="ml-1 text-sm text-gray-600">{item.totalProject} Projects</Text>
          </View>
        </View>

        <View className="mt-2 flex-row items-center">
          {item.ownerUserAvatar ? (
            <Image
              source={{ uri: item.ownerUserAvatar }}
              className="h-6 w-6 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-6 w-6 items-center justify-center rounded-full bg-gray-200">
              <FontAwesome5 name="user" size={12} color="#555" />
            </View>
          )}
          <Text className="ml-2 text-sm text-gray-700">
            {item.ownerUserName?.trim() ? item.ownerUserName : 'Owner'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar hidden />
      <AlertHeader />

      <View className="flex-1 bg-gray-50 pt-3">
        {/* Search Bar */}
        <View className="mx-4 mb-4 flex-row items-center rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <FontAwesome5 name="search" size={16} color="#888" />
          <TextInput
            placeholder="Search company ..."
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1 text-gray-700"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Filter */}
        <View className="mx-4 mb-2 flex-row items-center justify-between">
          <FilterSection
            onFilterChange={(newFilter) => {
              dispatch(resetCompanies());
              dispatch(updateFilter({ ...newFilter, pageNumber: 1 }));
              dispatch(fetchCompaniesThunk({ ...newFilter, pageNumber: 1 }));
            }}
          />
        </View>

        {/* Danh sách công ty */}
        {loading && data.length === 0 ? (
          <ActivityIndicator size="large" color="#007bff" className="mt-10" />
        ) : data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Image
              source={emptyImages.emptyCompany}
              className="mb-4 h-48 w-48"
              resizeMode="contain"
            />
            <Text className="text-base text-gray-400">No companies found</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderCompany}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ListFooterComponent={
              loading ? (
                <View className="py-3">
                  <Text className="text-center text-gray-500">Loading...</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </>
  );
};

export default Home;
