import ActivityStreamSection from '@/components/analytics-layout/activityStreamSection';
import DashboardCharts from '@/components/analytics-layout/dashboardChartSection';
import TaskAssignedToMe from '@/components/analytics-layout/taskAssginSection';
import AlertHeader from '@/components/layouts/alert-header';
import { ANALYTICSTABS } from '@/constants/navigate/tabs';
import { AnalyticsUserResponse } from '@/interfaces/user';
import { ROUTES } from '@/routes/route';
import { getAnalyticsUser } from '@/src/services/userService';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Analytics = () => {
  const [analyticData, setAnalyticData] = useState<AnalyticsUserResponse | null>(null);

  const [overview, setOverview] = useState([
    {
      label: 'Total Tasks Assigned',
      value: 0,
      desc: 'Total tasks assigned',
      icon: 'clipboard-list',
    },
    {
      label: 'Total Companies',
      value: 0,
      desc: 'Total companies user participates',
      icon: 'building',
    },
    {
      label: 'Total Projects',
      value: 0,
      desc: 'Total projects user participates',
      icon: 'folder-open',
    },
    {
      label: 'Total Subscriptions',
      value: 0,
      desc: 'Total subscriptions purchased',
      icon: 'credit-card',
    },
  ]);

  const [dashboard, setDashboard] = useState([
    { label: 'Bug', value: 0, color: '#DC2626' }, // red
    { label: 'Feature', value: 0, color: '#3B82F6' }, // blue
    { label: 'Chore', value: 0, color: '#6B7280' }, // gray
    { label: 'Overdue', value: 0, color: '#F87171' }, // light red
    { label: 'On Time', value: 0, color: '#34D399' }, // green
    { label: 'Early Completed', value: 0, color: '#60A5FA' }, // light blue
  ]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assign');

  const scrollRef = useRef<ScrollView>(null);
  const tabRefs = useRef<any[]>([]);

  const tabLayouts = useRef<{ x: number; width: number }[]>([]);

  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(true);
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalyticsUser();
        setAnalyticData(data);
      } catch (error) {
        console.error('Failed to fetch analytics user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (analyticData) {
      setOverview((prev) =>
        prev.map((s) => {
          if (s.label === 'Total Tasks Assigned')
            return { ...s, value: analyticData.userPerformance.totalProjects || 0 };
          if (s.label === 'Total Companies')
            return { ...s, value: analyticData.userPerformance.totalCompanies || 0 };
          if (s.label === 'Total Projects')
            return { ...s, value: analyticData.userPerformance.totalProjects || 0 };
          if (s.label === 'Total Subscriptions')
            return { ...s, value: analyticData.userPerformance.totalSubscriptions || 0 };
          return s;
        }),
      );

      setDashboard((prev) =>
        prev.map((s) => {
          if (s.label === 'Bug') return { ...s, value: analyticData.dashboard.bugPercent || 0 };
          if (s.label === 'Feature')
            return { ...s, value: analyticData.dashboard.featurePercent || 0 };
          if (s.label === 'Chore') return { ...s, value: analyticData.dashboard.chorePercent || 0 };
          if (s.label === 'Overdue')
            return { ...s, value: analyticData.dashboard.overduePercent || 0 };
          if (s.label === 'On Time')
            return { ...s, value: analyticData.dashboard.onTimePercent || 0 };
          if (s.label === 'Early Completed')
            return { ...s, value: analyticData.dashboard.earlyCompletedPercent || 0 };
          return s;
        }),
      );
    }
  }, [analyticData]);

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

  return (
    <>
      <StatusBar hidden={true} />
      <AlertHeader />
      {/* Header */}
      <View className=" bg-white px-7">
        <Text className="text-2xl font-bold text-black">Analytics</Text>
      </View>

      {loading && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}
        >
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ color: '#6B7280', fontSize: 15 }}>Loading user anaytics...</Text>
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{ paddingBottom: 80 }}
        nestedScrollEnabled
      >
        {/* Performance Overview */}
        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {overview.map((s, i) => (
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

        {/* Tabs Navigation */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5, marginTop: 20 }}
        >
          <View style={{ flexDirection: 'row', position: 'relative' }}>
            {ANALYTICSTABS.map((tab, index) => {
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

                    // Khi layout đo xong tab đầu tiên, set underline
                    if (index === 0 && activeTab === 'assign') {
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
          {activeTab === 'assign' && (
            <TaskAssignedToMe
              assignToMe={analyticData?.assignToMe || []}
              onTaskPress={(task) => {
                router.push({
                  pathname: ROUTES.TASK.ANALYTICS_TASK as any,
                  params: { id: task.id, backRoute: ROUTES.HOME.ANALYTICS },
                });
              }}
            />
          )}
          {activeTab === 'dashboard' && <DashboardCharts dashboard={dashboard} />}
          {activeTab === 'activity' && <ActivityStreamSection />}
        </View>
      </ScrollView>
    </>
  );
};

export default Analytics;
