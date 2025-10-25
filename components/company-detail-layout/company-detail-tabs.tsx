import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CompanyTabsProps {
  tabs: string[];
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const CompanyTabs: React.FC<CompanyTabsProps> = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <View className="mt-20 flex-row justify-around border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onChangeTab(tab)}
          className={`py-3 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text
            className={`text-base ${
              activeTab === tab ? 'font-semibold text-blue-600' : 'text-gray-500'
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CompanyTabs;
