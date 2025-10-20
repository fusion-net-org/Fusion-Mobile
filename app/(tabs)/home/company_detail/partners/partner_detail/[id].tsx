import ActivitySection from '@/components/partner-detail-layout/activity_section';
import OverviewSection from '@/components/partner-detail-layout/overview_section';
import ProjectRequestSection from '@/components/partner-detail-layout/project_request_section';
import { PARTNERDETAILTABS } from '@/constants/navigate/tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PartnerSummary() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Projects', value: 12, desc: 'Total collaborations', icon: 'briefcase' },
    { label: 'Members', value: 28, desc: 'Partner staff', icon: 'users' },
    { label: 'Rating', value: '4.8', desc: 'Average feedback', icon: 'star' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'activity':
        return <ActivitySection />;
      case 'project_request':
        return <ProjectRequestSection />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Summary header */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          }}
          style={{ width: '100%', height: 200 }}
        />

        <View
          style={{
            position: 'absolute',
            left: 20,
            bottom: -60,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: 'https://i.ibb.co/G5vT7pR/company-avatar.jpg' }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 4,
              borderColor: '#fff',
            }}
          />
          <View style={{ marginLeft: 16, marginTop: 40 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#111' }}>Beta Logistics</Text>
            <Text style={{ fontSize: 13, color: '#6B7280' }}>Since 16/10/2025</Text>
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
      <View style={{ marginTop: 20 }}>{renderTabContent()}</View>
    </ScrollView>
  );
}
