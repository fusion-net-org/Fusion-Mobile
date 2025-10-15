import { Image, Text, TouchableOpacity, View } from 'react-native';

const CompanyCard = ({ company }: { company: any }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="mb-4 w-[48%] overflow-hidden rounded-2xl bg-white shadow-sm"
    >
      <Image source={{ uri: company.image }} className="h-28 w-full" resizeMode="cover" />
      <View className="p-3">
        <Text className="text-base font-semibold">{company.name}</Text>
        <Text className="mb-2 text-xs text-gray-500">Subscription</Text>

        <View className="mb-2 flex-row flex-wrap">
          <View
            className={`rounded-full px-2 py-0.5 ${
              company.role === 'Owner'
                ? 'bg-yellow-100'
                : company.role === 'Leader'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-xs ${
                company.role === 'Owner'
                  ? 'text-yellow-700'
                  : company.role === 'Leader'
                    ? 'text-green-700'
                    : 'text-gray-600'
              }`}
            >
              {company.role}
            </Text>
          </View>
        </View>

        <View className="mt-1 flex-row items-center justify-between">
          <Text className="text-sm text-gray-700">👥 {company.members} members</Text>
          <Text className="text-sm text-gray-700">📁 {company.projects} projects</Text>
        </View>

        <View className="mt-2 border-t border-gray-100 pt-2">
          <Text className="text-xs text-gray-500">Owner</Text>
          <Text className="text-sm font-medium">{company.leader}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CompanyCard;
