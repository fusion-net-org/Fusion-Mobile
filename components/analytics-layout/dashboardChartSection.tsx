import { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

interface DashboardChartsProps {
  dashboard: {
    label: string;
    value: number;
    color: string;
  }[];
}

const DashboardCharts = ({ dashboard }: DashboardChartsProps) => {
  const [activeTab, setActiveTab] = useState<'type' | 'status'>('type');

  // Lọc dữ liệu cho 2 tab
  const taskTypeData = {
    labels: dashboard
      .filter((d) => ['Bug', 'Feature', 'Chore'].includes(d.label))
      .map((d) => d.label),
    datasets: [
      {
        data: dashboard
          .filter((d) => ['Bug', 'Feature', 'Chore'].includes(d.label))
          .map((d) => d.value),
      },
    ],
  };

  const taskStatusData = {
    labels: dashboard
      .filter((d) => ['Overdue', 'On Time', 'Early Completed'].includes(d.label))
      .map((d) => d.label),
    datasets: [
      {
        data: dashboard
          .filter((d) => ['Overdue', 'On Time', 'Early Completed'].includes(d.label))
          .map((d) => d.value),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: { borderRadius: 16 },
    propsForBackgroundLines: { stroke: '#eee', strokeDasharray: '3' },
  };

  return (
    <View style={{ padding: 16 }}>
      {/* Tabs */}
      <View style={{ flexDirection: 'row', marginBottom: 16, borderRadius: 8, overflow: 'hidden' }}>
        {['type', 'status'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={{
              flex: 1,
              backgroundColor: activeTab === tab ? '#6366F1' : '#E5E7EB',
              paddingVertical: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: activeTab === tab ? '#fff' : '#374151', fontWeight: '600' }}>
              {tab === 'type' ? 'Task Type %' : 'Task Status %'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bar Chart */}
      <BarChart
        data={activeTab === 'type' ? taskTypeData : taskStatusData}
        width={screenWidth}
        height={220}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={{ borderRadius: 16 }}
        verticalLabelRotation={0}
      />
    </View>
  );
};

export default DashboardCharts;
