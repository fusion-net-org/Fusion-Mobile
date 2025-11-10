import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface PerformanceSectionProps {
  partnerName: string;
  partnerId?: string;
}

const screenWidth = Dimensions.get('window').width - 40; // padding 2 bên

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ partnerName, partnerId }) => {
  // Demo data, sau này có thể fetch theo partnerId
  const data = {
    labels: ['On-Time', 'Violations', 'Completed'],
    datasets: [
      {
        data: [85, 3, 47],
      },
    ],
  };

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
