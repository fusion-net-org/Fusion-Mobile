import { Company } from '@/interfaces/company';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

interface Props {
  company: Company;
}

interface ChartCardProps {
  title: string;
  data: { label: string; value: number }[];
  color: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, color }) => {
  return (
    <View className="mb-6 w-full rounded-2xl bg-white px-4 py-5 shadow-md">
      {/* Title */}
      <Text className="mb-4 text-center text-base font-bold text-gray-900">{title}</Text>

      {/* Chart */}
      <BarChart
        data={data.map((item) => ({
          value: item.value,
          label: item.label,
          frontColor: color,
          topLabelComponent: () => (
            <Text className="text-[10px] font-semibold text-gray-900">{item.value}</Text>
          ),
        }))}
        width={screenWidth - 64}
        barWidth={26}
        spacing={24}
        roundedTop
        hideRules
        hideYAxisText
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={4}
        isAnimated
        animationDuration={700}
        xAxisLabelTextStyle={{
          fontSize: 10,
          color: '#6B7280',
        }}
      />
    </View>
  );
};

const DashBoardCompanyDetailSection: React.FC<Props> = ({ company }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 24,
        paddingTop: 16,
        paddingHorizontal: 16,
      }}
    >
      {/* Chart 1: Project Performance */}
      <ChartCard
        title="Project Performance Overview"
        color="#3B82F6"
        data={[
          { label: 'On-Time', value: company.onTimeRelease ?? 0 },
          { label: 'Ongoing', value: company.totalOngoingProjects ?? 0 },
          { label: 'Completed', value: company.totalCompletedProjects ?? 0 },
          { label: 'Closed', value: company.totalClosedProjects ?? 0 },
          { label: 'Late', value: company.totalLateProjects ?? 0 },
        ]}
      />

      {/* Chart 2: Members by Role */}
      <ChartCard
        title="Company Members by Role"
        color="#10B981"
        data={
          company.companyRoles?.map((role) => ({
            label: role.roleName,
            value: role.totalMembers,
          })) ?? []
        }
      />

      {/* Chart 3: Projects Created vs Hired */}
      <ChartCard
        title="Projects Created vs Hired"
        color="#F59E0B"
        data={[
          { label: 'Created', value: company.totalProjectCreated ?? 0 },
          { label: 'Hired', value: company.totalProjectHired ?? 0 },
        ]}
      />

      {/* Chart 4: Project Requests */}
      <ChartCard
        title="Project Requests Sent vs Received"
        color="#6366F1"
        data={[
          { label: 'Sent', value: company.totalProjectRequestSent ?? 0 },
          { label: 'Received', value: company.totalProjectRequestReceive ?? 0 },
        ]}
      />
    </ScrollView>
  );
};

export default DashBoardCompanyDetailSection;
