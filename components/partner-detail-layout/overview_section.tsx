import { Company } from '@/interfaces/company';
import { FontAwesome5 } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

interface OverviewSectionProps {
  partnerData: Company;
}

export default function OverviewSection({ partnerData }: OverviewSectionProps) {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View className="px-5 pb-10" style={{ paddingBottom: tabBarHeight + 25 }}>
      {/*Company Info */}
      <Text className="mb-4 text-xl font-semibold text-gray-900">Company Overview</Text>

      <View className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <View className="mb-3 flex-row items-center gap-3">
          <FontAwesome5 name="building" size={18} color="#2563EB" />
          <Text className="text-lg font-medium text-gray-800">{partnerData.name}</Text>
        </View>

        <View className="gap-2">
          <Text className="text-gray-600">🧑 Owner: {partnerData.ownerUserName}</Text>
          <Text className="text-gray-600">📧 Email: {partnerData.email}</Text>
          <Text className="text-gray-600">💳 Tax Code: {partnerData.taxCode}</Text>
          <Text className="text-gray-600">📅 Created: {partnerData.createAt}</Text>
          <Text className="text-gray-600">🕓 Updated: {partnerData.updateAt}</Text>
        </View>
      </View>

      {/* Description */}
      {partnerData.detail && (
        <View className="mt-6">
          <Text className="mb-2 text-lg font-semibold text-gray-900">Description</Text>
          <Text className="text-base leading-6 text-gray-700">{partnerData.detail}</Text>
        </View>
      )}
    </View>
  );
}
