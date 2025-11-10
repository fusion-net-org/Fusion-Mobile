import { Company } from '@/interfaces/company';
import React from 'react';
import { Dimensions, ScrollView, Text, View, ViewStyle } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 64; // khoảng cách 32px hai bên

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
  },
  paddingLeft: 0,
  propsForLabels: {
    fontSize: 9,
    rotation: 0,
    yOffset: 4,
  },
};

interface Props {
  company: Company;
}

const DashBoardCompanyDetailSection: React.FC<Props> = ({ company }) => {
  const insets = useSafeAreaInsets();

  const chartContainerStyle: ViewStyle = {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: chartWidth,
    overflow: 'visible',
    alignSelf: 'center',
  };

  const chartStyle: ViewStyle = {
    borderRadius: 16,
    alignSelf: 'center',
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingVertical: 16,
        alignItems: 'center',
        paddingBottom: insets.bottom + 16, // tránh bị Bottom Tab Bar che
      }}
    >
      {/* Chart 1: Project Performance */}
      <View style={chartContainerStyle}>
        <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 }}>
          {company.name} Project Performance Overview
        </Text>
        <BarChart
          data={{
            labels: ['On-Time', 'Ongoing', 'Completed', 'Closed', 'Late'],
            datasets: [
              {
                data: [
                  company.onTimeRelease ?? 0,
                  company.totalOngoingProjects ?? 0,
                  company.totalCompletedProjects ?? 0,
                  company.totalClosedProjects ?? 0,
                  company.totalLateProjects ?? 0,
                ],
              },
            ],
          }}
          width={chartWidth * 0.9}
          height={250}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars
          withInnerLines={false}
          withHorizontalLabels
          chartConfig={chartConfig}
          style={chartStyle}
        />
      </View>

      {/* Chart 2: Company Members by Role */}
      <View style={chartContainerStyle}>
        <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 }}>
          Company Members by Role
        </Text>
        <BarChart
          data={{
            labels: company.companyRoles?.map((role) => role.roleName) ?? [],
            datasets: [
              {
                data: company.companyRoles?.map((role) => role.totalMembers) ?? [],
              },
            ],
          }}
          width={chartWidth * 0.9}
          height={250}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars
          withInnerLines={false}
          withHorizontalLabels
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          }}
          style={chartStyle}
        />
      </View>

      {/* Chart 3: Projects Created vs Hired */}
      <View style={chartContainerStyle}>
        <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 }}>
          Projects Created vs Hired
        </Text>
        <BarChart
          data={{
            labels: ['Created', 'Hired'],
            datasets: [
              {
                data: [company.totalProjectCreated ?? 0, company.totalProjectHired ?? 0],
              },
            ],
          }}
          width={chartWidth * 0.9}
          height={200}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars
          withInnerLines={false}
          withHorizontalLabels
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
          }}
          style={chartStyle}
        />
      </View>

      {/* Chart 4: Project Requests Sent vs Received */}
      <View style={chartContainerStyle}>
        <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 }}>
          Project Requests Sent vs Received
        </Text>
        <BarChart
          data={{
            labels: ['Sent', 'Received'],
            datasets: [
              {
                data: [
                  company.totalProjectRequestSent ?? 0,
                  company.totalProjectRequestReceive ?? 0,
                ],
              },
            ],
          }}
          width={chartWidth * 0.9}
          height={200}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars
          withInnerLines={false}
          withHorizontalLabels
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          }}
          style={chartStyle}
        />
      </View>
    </ScrollView>
  );
};

export default DashBoardCompanyDetailSection;
