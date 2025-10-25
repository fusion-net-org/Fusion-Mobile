import { Company } from '@/interfaces/company';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const ProjectInformationSection = ({ company }: { company: Company }) => {
  return (
    <View className="space-y-5">
      {/* Tổng quan */}
      <View className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <View className="mb-3 flex-row items-center">
          <View className="mr-3 rounded-2xl bg-blue-100 p-3">
            <FontAwesome5 name="project-diagram" size={20} color="#2563EB" />
          </View>
          <View>
            <Text className="text-sm text-gray-500">Related project request number</Text>
            <Text className="mt-1 text-2xl font-bold text-blue-600">{company.totalProject}</Text>
          </View>
        </View>

        <Text className="text-sm leading-5 text-gray-500">
          Total project requests associated with this company.
        </Text>
      </View>

      {/* Thống kê chi tiết */}
      <View className="mt-3 flex-row justify-between">
        {[
          {
            icon: 'paper-plane',
            color: '#EAB308',
            bg: 'bg-yellow-100',
            label: 'Submitted',
            value: company.totalWaitForApprove,
          },
          {
            icon: 'search',
            color: '#FB923C',
            bg: 'bg-orange-100',
            label: 'Review / Need Info',
            value: company.totalPartners,
          },
          {
            icon: 'check-circle',
            color: '#22C55E',
            bg: 'bg-green-100',
            label: 'Approved',
            value: company.totalApproved,
          },
        ].map((item, index) => (
          <View
            key={index}
            className="mx-1 flex-1 items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <View className={`mb-2 rounded-2xl p-3 ${item.bg}`}>
              <FontAwesome5 name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text className="text-center text-sm text-gray-500">{item.label}</Text>
            <Text className="mt-1 text-lg font-bold text-gray-800">{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProjectInformationSection;
