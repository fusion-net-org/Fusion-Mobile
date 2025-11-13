import WorkflowMini from '@/components/workflow-layout/WorkflowMini';
import WorkflowPreviewModal from '@/components/workflow-layout/WorkflowPreviewModal';
import { Workflow } from '@/interfaces/workflow';
import { getWorkflowPreviews } from '@/src/services/workflowService';
import { useLocalSearchParams } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const WorkFlows = () => {
  const { id: companyId } = useLocalSearchParams();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getWorkflowPreviews(String(companyId));
        setWorkflows(res ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const renderItem = ({ item }: { item: Workflow }) => (
    <View className="mb-4 overflow-hidden rounded-lg bg-white p-3 shadow">
      {/* Top row: Name + Preview */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-medium">{item.name}</Text>
        <TouchableOpacity
          onPress={() => setSelectedWorkflow(item)}
          className="rounded bg-gray-100 p-1"
        >
          <Eye size={16} />
        </TouchableOpacity>
      </View>

      {/* Workflow thumbnail */}
      <WorkflowMini data={{ statuses: item.statuses }} />

      {/* Type badge */}
      <View className="mt-2 self-start rounded bg-blue-100 px-2 py-0.5">
        <Text className="text-[10px] font-semibold text-blue-600">{item.ptype || 'Internal'}</Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar hidden />
      <View className="flex-1 bg-gray-50 p-4">
        <Text className="mb-4 text-lg font-semibold">Company Workflows</Text>

        {loading ? (
          <ActivityIndicator size="large" className="mt-10" />
        ) : workflows.length === 0 ? (
          <Text className="text-gray-500">No workflows found.</Text>
        ) : (
          <FlatList
            data={workflows}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {selectedWorkflow && (
          <WorkflowPreviewModal
            open={!!selectedWorkflow}
            onClose={() => setSelectedWorkflow(null)}
            workflow={selectedWorkflow} // truyền toàn bộ workflow
          />
        )}
      </View>
    </>
  );
};

export default WorkFlows;
