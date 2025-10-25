import { Company } from '@/interfaces/company';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

const OverviewCompanySection = ({ company }: { company: Company }) => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
      <View className="mt-2 space-y-4">
        {/* --- Profile --- */}
        <View className="flex-row items-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <View className="rounded-r-2xl bg-blue-50 p-4">
            <FontAwesome5 name="building" size={20} color="#2563EB" />
          </View>
          <View className="flex-1 p-4">
            <Text className="mb-1 text-lg font-semibold text-gray-800">Profile</Text>
            <Text className="text-gray-600">
              <Text className="font-medium text-gray-700">Business Name:</Text> {company.name}
            </Text>
            <Text className="text-gray-600">
              <Text className="font-medium text-gray-700">Company ID:</Text> {company.taxCode}
            </Text>
            <Text className="text-gray-600">
              <Text className="font-medium text-gray-700">Status:</Text>{' '}
              <Text className="font-semibold text-green-600">Active</Text>
            </Text>
          </View>
        </View>

        {/* --- Detail --- */}
        <View className="mt-5 flex-row items-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <View className="rounded-r-2xl bg-blue-50 p-4">
            <Ionicons name="book-outline" size={20} color="#2563EB" />
          </View>
          <View className="flex-1 p-4">
            <Text className="mb-1 text-lg font-semibold text-gray-800">Detail</Text>
            <Text className="leading-6 text-gray-600">
              {company.detail
                ? company.detail
                : 'No detailed description provided for this company.'}
            </Text>
          </View>
        </View>

        {/* --- Vision & Mission --- */}
        <View className="mt-5 flex-row items-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <View className="rounded-r-2xl bg-blue-50 p-4">
            <FontAwesome5 name="bullseye" size={20} color="#2563EB" />
          </View>
          <View className="flex-1 p-4">
            <Text className="mb-1 text-lg font-semibold text-gray-800">Vision & Mission</Text>
            <Text className="leading-6 text-gray-600">
              Empower innovation and collaboration among members.
            </Text>
            <Text className="leading-6 text-gray-600">
              Build sustainable partnerships and deliver long-term value.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OverviewCompanySection;
