import TicketDetailSection from '@/components/ticket-detail-layout/TicketDetailSection';
import { ROUTES } from '@/routes/route';
import { useLocalSearchParams } from 'expo-router';

const TicketDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <TicketDetailSection id={id as string} backRoute={ROUTES.PROJECT.REQUEST as string} />
    </>
  );
};

export default TicketDetailPage;
