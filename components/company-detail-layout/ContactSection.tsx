import { Company } from '@/interfaces/company';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const ContactSection = ({ company }: { company: Company }) => {
  const infoItems = [
    {
      icon: 'envelope',
      label: 'Email',
      value: company.email || 'N/A',
    },
    {
      icon: 'user-tie',
      label: 'Owner',
      value: company.ownerUserName || 'N/A',
    },
    {
      icon: 'phone',
      label: 'Phone Number',
      value: company.phoneNumber || 'N/A',
    },
    {
      icon: 'globe',
      label: 'Website',
      value: company.website || '**********',
    },
    {
      icon: 'map-marker-alt',
      label: 'Address',
      value: company.address || 'N/A',
    },
  ];

  return (
    <View className="space-y-4 pb-20">
      {infoItems.map((item, index) => (
        <View
          key={index}
          className="flex-row items-start rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <View className="mr-3 rounded-2xl bg-blue-100 p-3">
            <FontAwesome5 name={item.icon as any} size={18} color="#2563EB" />
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500">{item.label}</Text>
            <Text className="text-base font-medium text-gray-800">{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ContactSection;
