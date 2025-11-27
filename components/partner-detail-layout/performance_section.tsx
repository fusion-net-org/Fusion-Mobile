import { GetPartnerTaskStats } from '@/src/services/partnerService';
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native-paper';

interface PerformanceSectionProps {
  partnerName: string;
  partnerId?: string;
}

const screenWidth = Dimensions.get('window').width - 40;

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ partnerName, partnerId }) => {
  const [chartData, setChartData] = useState<number[]>([0, 0, 0]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await GetPartnerTaskStats(partnerId);
      if (data) {
        setChartData([data.onTime, data.violations, data.completed]);
      }
      setLoading(false);
    };

    fetchData();
  }, [partnerId]);

  const data = {
    labels: ['On-Time', 'Violations', 'Completed'],
    datasets: [{ data: chartData }],
  };

  if (loading) {
    return (
      <View className="p-4">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View className="p-4 pb-24">
      <View className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
        <Text className="mb-3 text-center text-sm font-semibold text-gray-700">
          {partnerName} Performance Overview
        </Text>

        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // #6366F1
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // #6B7280
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              stroke: '#eee',
              strokeDasharray: '3',
            },
          }}
          style={{
            borderRadius: 16,
          }}
          verticalLabelRotation={0}
        />
      </View>
    </View>
  );
};

export default PerformanceSection;
