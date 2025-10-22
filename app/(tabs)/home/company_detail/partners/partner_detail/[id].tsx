import ActivitySection from '@/components/partner-detail-layout/activity_section';
import OverviewSection from '@/components/partner-detail-layout/overview_section';
import ProjectRequestSection from '@/components/partner-detail-layout/project_request_section';
import { emptyImages } from '@/constants/image/image';
import { PARTNERDETAILTABS } from '@/constants/navigate/tabs';
import { Company } from '@/interfaces/company';
import { fetchCompanyByIdThunk } from '@/src/redux/compnaySlice';
import { useAppDispatch } from '@/src/redux/store';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PartnerSummary() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companyId = id;
  const [partnerData, setPartnerData] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const [stats, setStats] = useState([
    { label: 'Projects', value: 12, desc: 'Total collaborations', icon: 'briefcase' },
    { label: 'Members', value: 28, desc: 'Partner staff', icon: 'users' },
    { label: 'Rating', value: '4.8', desc: 'Average feedback', icon: 'star' },
  ]);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const response = await dispatch(fetchCompanyByIdThunk(companyId)).unwrap();
        setPartnerData(response);
      } catch (err) {
        console.error('❌ Lỗi fetch partner:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPartner();
  }, [companyId, dispatch]);

  useEffect(() => {
    if (partnerData) {
      setStats((prev) =>
        prev.map((s) => {
          if (s.label === 'Projects') return { ...s, value: partnerData.totalProject || 0 };
          if (s.label === 'Members') return { ...s, value: partnerData.totalMember || 0 };
          return s;
        }),
      );
    }
  }, [partnerData]);

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

      {!loading && !partnerData && (
        <View className="flex-1 items-center justify-center">
          <Image
            source={emptyImages.emptyCompany}
            className="mb-4 h-48 w-48"
            resizeMode="contain"
          />
          <Text className="text-base text-gray-400">No companies found</Text>
        </View>
      )}

      {partnerData && (
        <>
          {/* Summary header */}
          <View className="relative w-full">
            <Image source={{ uri: partnerData.imageCompany }} className="h-52 w-full" />
            <View className="absolute -bottom-16 left-5 flex-row items-center pt-10">
              <Image
                source={{ uri: partnerData.avatarCompany }}
                className="h-24 w-24 rounded-full border-4 border-white"
              />
              <View className="ml-4 mt-10">
                <Text className="text-[22px] font-bold text-gray-900">{partnerData.name}</Text>
                <Text className="text-sm text-gray-500">
                  Since {formatLocalDate(partnerData.createAt)}
                </Text>
              </View>
            </View>
          </View>
          {/* Stats */}
          <View
            style={{
              marginTop: 80,
              paddingHorizontal: 20,
              flexWrap: 'wrap',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            {stats.map((s, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  minWidth: 150,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 16,
                  padding: 12,
                  backgroundColor: '#fafafa',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FontAwesome5 name={s.icon as any} size={20} color="#2563EB" />
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>{s.label}</Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#111', marginTop: 4 }}>
                  {s.value}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{s.desc}</Text>
              </View>
            ))}
          </View>
          {/* Tabs navigation */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
              marginTop: 20,
            }}
          >
            {PARTNERDETAILTABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderBottomWidth: 2,
                    borderBottomColor: isActive ? '#2563EB' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: isActive ? '#2563EB' : '#6B7280',
                    }}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Nội dung tab */}
          <View style={{ marginTop: 20 }}>
            <View style={{ marginTop: 20 }}>
              {activeTab === 'overview' && (
                <View>
                  <OverviewSection partnerData={partnerData!} />
                </View>
              )}

              {activeTab === 'activity' && (
                <View>
                  <ActivitySection />
                </View>
              )}

              {activeTab === 'project_request' && (
                <View>
                  <ProjectRequestSection partnerId={companyId} />
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}
