import { RejectProjectRequest } from '@/src/services/project_requestService';
import LoadingOverlay from '@/src/utils/loadingOverlay';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface RejectReasonModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
  onSuccess?: () => void;
}

const defaultReasons = [
  'Out of contractual scope',
  'Budget not available',
  'Insufficient staffing resources',
  'Failure to meet technical specifications',
  'Infeasible schedule',
  'Other',
];

const RejectReasonModalSection: React.FC<RejectReasonModalProps> = ({
  open,
  onClose,
  projectId,
  onSuccess,
}) => {
  const [reasons, setReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleReason = (reason: string) => {
    if (reasons.includes(reason)) {
      setReasons(reasons.filter((r) => r !== reason));
    } else {
      setReasons([...reasons, reason]);
    }
  };

  const handleReject = async () => {
    if (!projectId) return;

    const finalReason = reasons.includes('Other')
      ? [...reasons.filter((r) => r !== 'Other'), customReason].join(', ')
      : reasons.join(', ');

    try {
      setLoading(true);
      const res = await RejectProjectRequest(projectId, finalReason);
      if (res.succeeded) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message || 'Request rejected successfully!',
        });
        onSuccess?.();
        handleClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message || 'Failed to reject request',
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message || 'Error rejecting request',
      });
    } finally {
      setLoading(false);
      setReasons([]);
      setCustomReason('');
    }
  };

  const handleClose = () => {
    setReasons([]);
    setCustomReason('');
    onClose();
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <View className="max-h-[80%] w-full rounded-2xl bg-white p-4">
          <LoadingOverlay loading={loading} message="Processing rejection..." />

          {/* Header */}
          <Text className="mb-1 text-lg font-semibold text-gray-800">Reject Project Request</Text>
          <Text className="mb-4 text-sm text-gray-500">
            Select one or more reasons for rejection
          </Text>

          <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
            {/* Reason List */}
            {defaultReasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                onPress={() => toggleReason(reason)}
                className={`mb-2 rounded-lg border px-3 py-2 ${
                  reasons.includes(reason)
                    ? 'border-red-400 bg-red-100'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text
                  className={`text-gray-800 ${reasons.includes(reason) ? 'font-semibold' : ''}`}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Custom Reason */}
            {reasons.includes('Other') && (
              <View className="mt-2">
                <Text className="mb-1 text-sm font-medium text-gray-700">Other reason</Text>
                <TextInput
                  placeholder="Enter custom reason"
                  value={customReason}
                  onChangeText={setCustomReason}
                  multiline
                  className="min-h-[80px] rounded-lg border border-gray-300 p-2 text-gray-800"
                />
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View className="mt-2 flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={handleClose}
              className="rounded-full border border-gray-300 bg-gray-100 px-4 py-2"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReject}
              disabled={loading}
              className="rounded-full bg-red-600 px-4 py-2 disabled:opacity-50"
            >
              <Text className="text-white">Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RejectReasonModalSection;
