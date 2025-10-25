import CompanyTabs from '@/components/company-detail-layout/company-detail-tabs';
import ContactSection from '@/components/company-detail-layout/ContactSection';
import OverviewCompanySection from '@/components/company-detail-layout/OverviewCompanySection';
import ProjectInforamtionSection from '@/components/company-detail-layout/ProjectInformationSection';
import { emptyImages } from '@/constants/image/image';
import { CompanyDetailTabs } from '@/constants/navigate/tabs';
import { Company } from '@/interfaces/company';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';

const CompanyDetail = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchCompany = async () => {
      const storedCompany = await AsyncStorage.getItem('selectedCompany');
      if (storedCompany) {
        const company = JSON.parse(storedCompany);
        if (company.id === id) setSelectedCompany(company);
      }
      setLoading(false);
    };
    fetchCompany();
  }, [id]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} nestedScrollEnabled>
      {loading && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
            gap: 12,
          }}
        >
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ color: '#6B7280', fontSize: 15 }}>Loading company details...</Text>
        </View>
      )}

      {!loading && !selectedCompany && (
        <View className="flex-1 items-center justify-center">
          <Image
            source={emptyImages.emptyCompany}
            className="mb-4 h-48 w-48"
            resizeMode="contain"
          />
          <Text className="text-base text-gray-400">No companies found</Text>
        </View>
      )}

      {selectedCompany && (
        <>
          {/* Summary header */}
          <View className="relative w-full">
            <Image source={{ uri: selectedCompany.imageCompany }} className="h-52 w-full" />
            <View className="absolute -bottom-16 left-5 flex-row items-center pt-10">
              <Image
                source={{ uri: selectedCompany.avatarCompany }}
                className="h-24 w-24 rounded-full border-4 border-white"
              />
              <View className="ml-4 mt-10">
                <Text className="text-[22px] font-bold text-gray-900">{selectedCompany.name}</Text>
                <Text className="text-sm text-gray-500">
                  Since {formatLocalDate(selectedCompany.createAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <CompanyTabs
            tabs={CompanyDetailTabs}
            activeTab={activeTab}
            onChangeTab={(tab) => setActiveTab(tab)}
          />

          {/* Nội dung từng tab */}
          <ScrollView className="p-5">
            {activeTab === 'Overview' && <OverviewCompanySection company={selectedCompany} />}
            {activeTab === 'Contact' && <ContactSection company={selectedCompany} />}
            {activeTab === 'Projects' && <ProjectInforamtionSection company={selectedCompany} />}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};

export default CompanyDetail;
