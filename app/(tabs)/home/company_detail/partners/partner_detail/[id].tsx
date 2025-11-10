import ActivitySection from '@/components/partner-detail-layout/activity_section';
import OverviewSection from '@/components/partner-detail-layout/overview_section';
import PerformanceSection from '@/components/partner-detail-layout/performance_section';
import ProjectRequestSection from '@/components/partner-detail-layout/project_request_section';
import { emptyImages } from '@/constants/image/image';
import { PARTNERDETAILTABS } from '@/constants/navigate/tabs';
import { Company } from '@/interfaces/company';
import { ILogActivity } from '@/interfaces/log_activity';
import { fetchCompanyByIdThunk } from '@/src/redux/compnaySlice';
import { useAppDispatch } from '@/src/redux/store';
import { AllActivityLogCompanyById } from '@/src/services/companyServices';
import { formatLocalDate } from '@/src/utils/formatLocalDate';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PartnerSummary() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companyId = id;
  const [partnerData, setPartnerData] = useState<Company | null>(null);
  const [logActivity, setLogActivity] = useState<ILogActivity[]>([]);
  const [activityForbidden, setActivityForbidden] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  // Tabs state
  const [activeTab, setActiveTab] = useState('overview');

  // Stats
  const [stats, setStats] = useState([
    { label: 'Total Projects', value: 12, desc: 'Total collaborations', icon: 'briefcase' },
    { label: 'Total Members', value: 28, desc: 'Partner staff', icon: 'users' },
    { label: 'Total Partner', value: 0, desc: 'Total partners', icon: 'building' },
    { label: 'Total Approve', value: 0, desc: 'Approved count', icon: 'check' },
  ]);

  // Animated Tabs
  const scrollRef = useRef<ScrollView>(null);
  const tabRefs = useRef<any[]>([]);
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);

  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index: number, key: string) => {
    setActiveTab(key);
    const layout = tabLayouts.current[index];
    if (!layout) return;

    // Animate underline
    Animated.parallel([
      Animated.timing(underlineX, {
        toValue: layout.x,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(underlineWidth, {
        toValue: layout.width,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    // Auto scroll to make tab visible
    scrollRef.current?.scrollTo({
      x: Math.max(layout.x - 50, 0),
      animated: true,
    });
  };

  // Initialize underline on first tab
  useEffect(() => {
    setTimeout(() => {
      const first = tabLayouts.current[0];
      if (first) {
        underlineX.setValue(first.x);
        underlineWidth.setValue(first.width);
      }
    }, 20);
  }, []);

  // Fetch company data
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const response = await dispatch(fetchCompanyByIdThunk(companyId)).unwrap();
        setPartnerData(response);

        try {
          const logActivityRes = await AllActivityLogCompanyById(id);
          if (logActivityRes?.succeeded && Array.isArray(logActivityRes?.data?.items)) {
            setLogActivity(logActivityRes.data.items);
          } else {
            setLogActivity([]);
          }
        } catch (error: any) {
          if (error.response?.status === 403) {
            setActivityForbidden(true);
            setLogActivity([]);
          } else {
            console.error('Error fetching activity logs:', error);
            setLogActivity([]);
          }
        }
      } catch (err) {
        console.error('❌ Lỗi fetch partner:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPartner();
  }, [companyId, dispatch]);

  // Update stats
  useEffect(() => {
    if (partnerData) {
      setStats((prev) =>
        prev.map((s) => {
          if (s.label === 'Total Projects') return { ...s, value: partnerData.totalProject || 0 };
          if (s.label === 'Total Members') return { ...s, value: partnerData.totalMember || 0 };
          if (s.label === 'Total Partner') return { ...s, value: partnerData.totalPartners || 0 };
          if (s.label === 'Total Approve') return { ...s, value: partnerData.totalApproved || 0 };
          return s;
        }),
      );
    }
  }, [partnerData]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} nestedScrollEnabled>
      {/* Loading */}
      {loading && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}
        >
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ color: '#6B7280', fontSize: 15 }}>Loading company details...</Text>
        </View>
      )}

      {/* No data */}
      {!loading && !partnerData && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={emptyImages.emptyCompany}
            style={{ height: 192, width: 192 }}
            resizeMode="contain"
          />
          <Text style={{ color: '#9CA3AF', fontSize: 16 }}>No companies found</Text>
        </View>
      )}

      {/* Data */}
      {partnerData && (
        <>
          {/* Header */}
          <View style={{ width: '100%', position: 'relative' }}>
            <Image
              source={{ uri: partnerData.imageCompany }}
              style={{ height: 208, width: '100%' }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -64,
                left: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: partnerData.avatarCompany }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 4,
                  borderColor: '#fff',
                }}
              />
              <View style={{ marginLeft: 16, paddingTop: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111' }}>
                  {partnerData.name}
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
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
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            {stats.map((s, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  minWidth: 150,
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: '#fafafa',
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FontAwesome5 name={s.icon as any} size={20} color="#2563EB" />
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>{s.label}</Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 4 }}>{s.value}</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{s.desc}</Text>
              </View>
            ))}
          </View>

          {/* Scrollable Tabs */}
          {/* Scrollable Tabs */}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5, marginTop: 20 }}
          >
            <View style={{ flexDirection: 'row', position: 'relative' }}>
              {PARTNERDETAILTABS.map((tab, index) => {
                const isActive = activeTab === tab.key;

                return (
                  <TouchableOpacity
                    key={tab.key}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    onLayout={(e) => {
                      const { x, width } = e.nativeEvent.layout;
                      tabLayouts.current[index] = { x, width };

                      // ✅ Khi layout đo xong tab đầu tiên, set underline
                      if (index === 0 && activeTab === 'overview') {
                        underlineX.setValue(x);
                        underlineWidth.setValue(width);
                      }
                    }}
                    onPress={() => handleTabPress(index, tab.key)}
                    style={{ paddingVertical: 12, paddingHorizontal: 20 }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: isActive ? '#2563EB' : '#6B7280',
                      }}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Animated underline */}
              <Animated.View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  height: 3,
                  backgroundColor: '#2563EB',
                  width: underlineWidth,
                  transform: [{ translateX: underlineX }],
                  borderRadius: 10,
                }}
              />
            </View>
          </ScrollView>

          {/* Tab Content */}
          <View style={{ marginTop: 20 }}>
            {activeTab === 'overview' && <OverviewSection partnerData={partnerData!} />}
            {activeTab === 'performance' && (
              <PerformanceSection partnerName={partnerData.name} partnerId={companyId} />
            )}
            {activeTab === 'project_request' && <ProjectRequestSection partnerId={companyId} />}
            {activeTab === 'activity' && <ActivitySection />}
          </View>
        </>
      )}
    </ScrollView>
  );
}
