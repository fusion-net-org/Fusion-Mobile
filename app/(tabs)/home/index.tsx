import FilterSection from '@/components/company-layout/filtersection';
import AlertHeader from '@/components/layouts/alert-header';
import { companies } from '@/constants/data/company';
import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Image, StatusBar, Text, TextInput, View } from 'react-native';
import '../../globals.css';

const Home = () => {
  const [search, setSearch] = useState('');

  // 👉 Giả lập lọc / sắp xếp
  const filtered = useMemo(() => {
    let data = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

    return data;
  }, [search]);

  const renderCompany = ({ item }: any) => (
    <View className="mx-4 mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <Image
        source={{ uri: item.image }}
        className="mb-3 h-40 w-full rounded-xl"
        resizeMode="cover"
      />

      <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
      <Text className="mb-2 text-sm text-gray-400">Subscription</Text>

      <View className="mb-3 flex-row flex-wrap gap-2">
        <View
          className={`rounded-full border px-3 py-1 ${
            item.role === 'Owner'
              ? 'border-yellow-400 bg-yellow-50'
              : item.role === 'Leader'
                ? 'border-green-400 bg-green-50'
                : 'border-blue-400 bg-blue-50'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              item.role === 'Owner'
                ? 'text-yellow-600'
                : item.role === 'Leader'
                  ? 'text-green-600'
                  : 'text-blue-600'
            }`}
          >
            {item.role}
          </Text>
        </View>
      </View>

      <View className="mb-2 flex-row justify-between">
        <View className="flex-row items-center">
          <FontAwesome5 name="users" size={14} color="#555" />
          <Text className="ml-1 text-sm text-gray-600">{item.members} Members</Text>
        </View>

        <View className="flex-row items-center">
          <FontAwesome5 name="folder" size={14} color="#555" />
          <Text className="ml-1 text-sm text-gray-600">{item.projects} Projects</Text>
        </View>
      </View>

      <View className="mt-2 flex-row items-center">
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} className="h-6 w-6 rounded-full" />
        <Text className="ml-2 text-sm text-gray-700">Owner {item.owner}</Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar hidden={true} />
      <AlertHeader />
      <View className="flex-1 bg-gray-50 pt-3">
        {/* Search Bar */}
        <View className="mx-4 mb-4 flex-row items-center rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <FontAwesome5 name="search" size={16} color="#888" />
          <TextInput
            placeholder="Search company..."
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1 text-gray-700"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Filter + Sort header */}
        <View className="mx-4 mb-2 flex-row items-center justify-between">
          <FilterSection />
        </View>

        {/* Company List */}
        <FlatList
          data={filtered}
          renderItem={renderCompany}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </>
  );
};

export default Home;
