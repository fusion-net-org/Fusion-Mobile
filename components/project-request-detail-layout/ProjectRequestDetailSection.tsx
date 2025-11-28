import {
  CheckCircle,
  FileText,
  Globe,
  Mail,
  Navigation,
  Phone,
  User,
  XCircle,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { GetCompanyById } from '@/src/services/companyServices';
import { getContractById } from '@/src/services/contractService';
import { AcceptProjectRequest, GetProjectRequestById } from '@/src/services/project_requestService';

import RejectReasonModal from '@/components/project-request-detail-layout/RejectReasonModalSection';
import { Company } from '@/interfaces/company';
import { ProjectRequest } from '@/interfaces/project_request';
import { ROUTES } from '@/routes/route';
import LoadingOverlay from '@/src/utils/loadingOverlay';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

interface Props {
  projectRequestId: string;
  companyId: string;
  backRoute: string;
}

export default function ProjectRequestWithDetailSection({
  projectRequestId,
  companyId,
  backRoute,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [projectRequest, setProjectRequest] = useState<ProjectRequest>();

  const [companyRequest, setCompanyRequest] = useState<Company>();
  const [companyExecutor, setCompanyExecutor] = useState<Company>();

  const [contract, setContract] = useState<any>();
  const [contractId, setContractId] = useState<string | null>(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState<string>();

  const [selectedDeleteProjectId, setSelectedDeleteProjectId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isDeleted = projectRequest?.isDeleted ?? false;

  const fetchData = async () => {
    try {
      setLoading(true);
      const projectRes = await GetProjectRequestById(projectRequestId);
      setProjectRequest(projectRes.data);

      setContractId(projectRes.contractId || null);

      const [reqRes, exeRes] = await Promise.all([
        GetCompanyById(projectRes.data.requesterCompanyId),
        GetCompanyById(projectRes.data.executorCompanyId),
      ]);
      setCompanyRequest(reqRes);
      setCompanyExecutor(exeRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contractId) {
      setContract(undefined);
      return;
    }

    const fetchContract = async () => {
      try {
        const res = await getContractById(contractId);
        setContract(res.data);
      } catch (err) {
        console.error('Failed to fetch contract:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load contract info',
        });
      }
    };

    fetchContract();
  }, [contractId]);

  const handleAccept = async () => {
    try {
      setAccepting(true);
      const res = await AcceptProjectRequest(projectRequestId);
      if (res.succeeded) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Request accepted successfully!',
        });
        fetchData();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message || 'Failed to accept request',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error while accepting request',
      });
    } finally {
      setAccepting(false);
    }
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    Pending: { bg: 'bg-yellow-300', text: 'text-yellow-800' },
    Accepted: { bg: 'bg-green-300', text: 'text-green-900' },
    Rejected: { bg: 'bg-red-300', text: 'text-red-900' },
  };

  useEffect(() => {
    fetchData();
  }, [projectRequestId]);

  const openRejectModal = () => {
    setSelectedProjectId(projectRequestId);
    setRejectModalOpen(true);
  };

  const status = projectRequest?.status || 'Pending';
  const color = statusColors[status] || statusColors['Pending'];

  if (loading) return <LoadingOverlay loading={loading} message="Loading Project Request..." />;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4" contentContainerStyle={{ paddingBottom: 110 }}>
      {accepting && <LoadingOverlay loading message="Accepting request..." />}

      {/* Header */}
      <View className="relative mb-6 overflow-hidden rounded-3xl">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1556761175-4b46a572b786' }}
          className="h-56 w-full"
        />
        <View className="absolute inset-0 justify-end bg-black/40 p-4">
          <Text className="text-2xl font-bold text-white">
            {projectRequest?.projectName || 'Unnamed Project'}
          </Text>
          <Text className="text-gray-300">
            {projectRequest?.code ? `#${projectRequest.code}` : '—'}
          </Text>
          <View className={`absolute right-4 top-4 rounded-full px-4 py-1 ${color.bg}`}>
            <Text className={`font-bold ${color.text}`}>{status}</Text>
          </View>
        </View>
      </View>

      {/* Overview */}
      <View className="mb-6 rounded-2xl bg-white p-4">
        <Text className="mb-2 text-lg font-bold color-['#3b82f6']">Project Overview</Text>
        <Text className="mb-4 text-gray-700">{projectRequest?.description || '—'}</Text>

        <InfoRow label="Project Code" value={projectRequest?.code} />
        <InfoRow label="Created By" value={projectRequest?.createdName} />
        <InfoRow
          label="Start Date"
          value={
            projectRequest?.startDate
              ? new Date(projectRequest.startDate).toLocaleDateString()
              : '—'
          }
        />
        <InfoRow
          label="End Date"
          value={
            projectRequest?.endDate ? new Date(projectRequest.endDate).toLocaleDateString() : '—'
          }
        />
      </View>

      {/* Companies */}
      <CompanyCard
        data={companyRequest}
        title="Requester Company"
        onPress={() => {
          if (!companyRequest) return;

          const isCurrentCompany = companyRequest.id === companyId;
          const url = isCurrentCompany ? ROUTES.COMPANY.DETAIL : ROUTES.PARTNER.DETAIL;

          router.push({
            pathname: `${url}/${companyRequest.id}` as any,
            params: { id: companyRequest.id },
          });
        }}
      />

      <CompanyCard
        data={companyExecutor}
        title="Executor Company"
        onPress={() => {
          if (!companyExecutor) return;

          const isCurrentCompany = companyExecutor.id === companyId;
          const url = isCurrentCompany ? ROUTES.COMPANY.DETAIL : ROUTES.PARTNER.DETAIL;

          router.push({
            pathname: `${url}/${companyExecutor.id}` as any,
            params: { id: companyExecutor.id },
          });
        }}
      />

      {/* Accept - Reject Button*/}
      <View className="flex-row flex-wrap justify-end gap-2">
        {projectRequest?.status === 'Pending' && (
          <>
            <ActionButton
              label="Accept"
              color="green"
              icon={<CheckCircle size={16} color="#16a34a" />}
              onPress={handleAccept}
            />
            <ActionButton
              label="Reject"
              color="red"
              icon={<XCircle size={16} color="#dc2626" />}
              onPress={openRejectModal}
            />
          </>
        )}

        {/* Project Button*/}
        {projectRequest?.status === 'Accepted' && projectRequest?.convertedProjectId && (
          <TouchableOpacity
            onPress={() => {
              const side =
                companyId === projectRequest.requesterCompanyId ? 'Requester' : 'Executor';

              const url =
                side === 'Requester'
                  ? `${ROUTES.PROJECT.REQUEST}/${projectRequest.convertedProjectId}`
                  : `${ROUTES.PROJECT.DETAIL}/${projectRequest.convertedProjectId}`;

              router.push({
                pathname: url as any,
                params: {
                  projectId: projectRequest.convertedProjectId,
                },
              });
            }}
            className="flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-3"
          >
            <Navigation size={16} color="white" className="mr-3" />
            <Text className="ml-2 text-center font-semibold text-white">Go to Project</Text>
          </TouchableOpacity>
        )}

        {/*Contract Button*/}
        {contractId && (
          <ActionButton
            label="View Contract"
            color="blue"
            icon={<FileText size={16} color="#2563eb" />}
            onPress={() =>
              router.push({
                pathname: ROUTES.COMPANY.DETAIL as any /* Chua co trang Contract */,
                params: { id: contractId },
              })
            }
          />
        )}
      </View>

      {/* Modals */}
      <RejectReasonModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        projectId={selectedProjectId ?? null}
        onSuccess={fetchData}
      />
    </ScrollView>
  );
}

/* ----------------- SUB COMPONENTS ----------------- */
const InfoRow = ({ label, value }: any) => (
  <View className="flex-row justify-between border-b py-1">
    <Text className="font-semibold">{label}:</Text>
    <Text>{value || '—'}</Text>
  </View>
);

const CompanyCard = ({ data, onPress, title }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-6 rounded-2xl bg-white p-5 shadow-md"
    activeOpacity={0.8}
  >
    <Text className="mb-4 text-xl font-bold ">{title}</Text>
    {data ? (
      <View className="flex-row items-start gap-6">
        <Image
          source={{ uri: data.avatarCompany || 'https://via.placeholder.com/150' }}
          className="h-24 w-24 rounded-full"
        />
        <View className="flex-1 space-y-2">
          <Text className="mb-2 text-lg font-bold text-gray-800">{data.name}</Text>

          <View className="mb-2">
            <CompanyField
              icon={<User color="#3b82f6" size={18} />}
              label="Representative"
              value={data.ownerUserName}
            />
          </View>

          <View className="mb-2">
            <CompanyField
              icon={<Mail color="#3b82f6" size={18} />}
              label="Email"
              value={data.email}
            />
          </View>

          <View className="mb-2">
            <CompanyField
              icon={<Phone color="#3b82f6" size={18} />}
              label="Phone"
              value={data.phoneNumber}
            />
          </View>

          <View className="mb-2">
            <CompanyField
              icon={<Globe color="#3b82f6" size={18} />}
              label="Website"
              value={data.website}
            />
          </View>
        </View>
      </View>
    ) : (
      <Text className="italic text-gray-500">Loading company info...</Text>
    )}
  </TouchableOpacity>
);

const CompanyField = ({ icon, label, value }: any) => (
  <View className="flex-row items-center gap-2">
    {icon}
    <Text className="font-medium">{label}:</Text>
    <Text className="flex-1" numberOfLines={1} ellipsizeMode="tail">
      {value || '—'}
    </Text>
  </View>
);

const ActionButton = ({ label, color, onPress, icon }: any) => {
  const colorStyles: any = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-lg border px-4 py-2 ${colorStyles[color]} mb-2`}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text className="font-medium">{label}</Text>
    </TouchableOpacity>
  );
};
