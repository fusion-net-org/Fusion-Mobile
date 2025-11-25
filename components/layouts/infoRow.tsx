import * as Icons from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

type IconName = keyof typeof Icons;

interface InfoRowProps {
  icon: IconName;
  label: string;
  value?: string | number | null;
  color?: string; // dùng cho priority/status
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, color }) => {
  // eslint-disable-next-line import/namespace
  const IconComponent = Icons[icon] as React.FC<any>;

  const valueColor =
    color === 'High'
      ? '#DC2626'
      : color === 'Medium'
        ? '#D97706'
        : color === 'Low'
          ? '#16A34A'
          : '#111827';

  return (
    <View className="flex-row items-start py-2">
      {IconComponent && (
        <IconComponent size={18} strokeWidth={2} color="#4B5563" className="mt-1" />
      )}
      <View className="ml-2 flex-1 flex-row items-center justify-between">
        <Text className="w-28 text-gray-500">{label}</Text>
        <Text
          className="flex-1 text-right font-medium"
          style={{ color: valueColor }}
          numberOfLines={2} // xuống dòng nếu quá dài
        >
          {value ?? '—'}
        </Text>
      </View>
    </View>
  );
};

export default InfoRow;
