import TaskDetailSection from '@/components/task-layout.tsx/TaskDetailSection';
import { ROUTES } from '@/routes/route';
import { useLocalSearchParams } from 'expo-router';

const TicketTaskDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <TaskDetailSection taskId={id as string} backRoute={ROUTES.TICKET.DETAIL as string} />
    </>
  );
};

export default TicketTaskDetailPage;
