import {
  BadgeCheck,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  Layers,
  Paperclip,
  Pencil,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { getContractById } from '@/src/services/contractService';

interface ContractDetailLayoutProps {
  contractId: string;
  projectRequestId: string;
}

const primary = '#2563EB';

const Label = ({ icon, text }: any) => (
  <View className="mb-1 flex-row items-center">
    {icon}
    <Text className="ml-1 text-sm font-medium text-gray-600">{text}</Text>
  </View>
);

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status?.toUpperCase();

  const map: any = {
    DRAFT: { bg: '#E5E7EB', color: '#374151' }, // gray
    PENDING: { bg: '#FEF9C3', color: '#A16207' }, // yellow
    ACCEPTED: { bg: '#DCFCE7', color: '#15803D' }, // green
    REJECTED: { bg: '#FEE2E2', color: '#B91C1C' }, // red
  };

  const style = map[normalized] || map.DRAFT;

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: style.bg,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 12,
      }}
    >
      <Text style={{ color: style.color, fontWeight: '600', fontSize: 12 }}>{normalized}</Text>
    </View>
  );
};

const ContractDetailLayout = ({ contractId }: ContractDetailLayoutProps) => {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<any | null>(null);

  useEffect(() => {
    if (contractId) fetchContract(contractId);
  }, [contractId]);

  const fetchContract = async (id: string) => {
    setLoading(true);
    try {
      const res = await getContractById(id);
      if (res.succeeded) setContract(res.data);
      else setContract(null);
    } catch (err) {
      console.log(err);
      setContract(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="border-b border-gray-300 bg-white px-4 py-4">
        <Text className="text-xl font-bold tracking-wide">Contract Overview</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : contract ? (
        <ScrollView className="px-4 py-4" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Contract ID */}
          <View className="mb-3 rounded-xl border bg-gray-50 p-4">
            <Label icon={<Hash size={16} color={primary} />} text="Contract ID" />
            <Text className="mt-1 font-semibold text-gray-800">{contract.id}</Text>
          </View>

          {/* Code + Status */}
          <View className="mb-3 flex-row gap-3">
            <View className="flex-1 rounded-xl border bg-white p-4">
              <Label icon={<BadgeCheck size={16} color={primary} />} text="Contract Code" />
              <Text className="mt-1 font-semibold text-gray-700">{contract.contractCode}</Text>
            </View>

            <View className="flex-1 rounded-xl border bg-white p-4">
              <Label icon={<Pencil size={16} color={primary} />} text="Status" />
              <View className="mt-2">
                <StatusBadge status={contract.status} />
              </View>
            </View>
          </View>

          {/* Title */}
          <View className="mb-3 rounded-xl border bg-white p-4">
            <Label icon={<FileText size={16} color={primary} />} text="Title" />
            <Text className="mt-1 font-semibold text-gray-800">{contract.contractName}</Text>
          </View>

          {/* Budget */}
          <View className="mb-3 rounded-xl border bg-white p-4">
            <Label icon={<DollarSign size={16} color={primary} />} text="Budget" />
            <Text className="mt-1 font-semibold text-gray-800">
              {contract.budget.toLocaleString('vi-VN')} VND
            </Text>
          </View>

          {/* Dates */}
          <View className="mb-3 flex-row gap-3">
            <View className="flex-1 rounded-xl border bg-white p-4">
              <Label icon={<Calendar size={16} color={primary} />} text="Effective Date" />
              <Text className="mt-1 font-semibold text-gray-700">
                {new Date(contract.effectiveDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>

            <View className="flex-1 rounded-xl border bg-white p-4">
              <Label icon={<Calendar size={16} color={primary} />} text="Expired Date" />
              <Text className="mt-1 font-semibold text-gray-700">
                {new Date(contract.expiredDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          </View>

          {/* Appendices */}
          <View className="mb-3 rounded-xl border bg-white p-4">
            <Label icon={<Layers size={18} color={primary} />} text="Appendices" />

            {contract.appendices?.length > 0 ? (
              contract.appendices.map((app: any) => (
                <View key={app.id} className="mb-2 flex-row rounded-lg border bg-gray-50 p-3">
                  <FileText size={18} color={primary} />
                  <View className="ml-2 flex-1">
                    <Text className="font-semibold text-gray-800">
                      {app.appendixCode} – {app.appendixName}
                    </Text>
                    {app.appendixDescription ? (
                      <Text className="mt-1 text-xs text-gray-500">{app.appendixDescription}</Text>
                    ) : null}
                  </View>
                </View>
              ))
            ) : (
              <Text className="py-4 text-center text-gray-400">No appendices available</Text>
            )}
          </View>

          {/* Attachment */}
          {contract.attachment && (
            <View className="mb-6 rounded-xl border bg-white p-4">
              <Label icon={<Paperclip size={18} color={primary} />} text="Attachment" />

              <TouchableOpacity onPress={() => Linking.openURL(contract.attachment)}>
                <Text className="mt-1 font-medium underline" style={{ color: primary }}>
                  View File
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-gray-400">No contract data available</Text>
        </View>
      )}
    </View>
  );
};

export default ContractDetailLayout;
