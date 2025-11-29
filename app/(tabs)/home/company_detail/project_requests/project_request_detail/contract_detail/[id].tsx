import ContractDetailLayout from '@/components/contract-layout/ContractDetailLayout';
import { useLocalSearchParams } from 'expo-router';

const ContractDetailPage = () => {
  const { id, projectRequestId } = useLocalSearchParams<{ id: string; projectRequestId: string }>();
  return (
    <>
      <ContractDetailLayout contractId={id} projectRequestId={projectRequestId} />
    </>
  );
};

export default ContractDetailPage;
