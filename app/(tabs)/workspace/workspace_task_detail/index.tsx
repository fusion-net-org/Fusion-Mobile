import AlertHeader from '@/components/layouts/alert-header';
import TaskDetailSection from '@/components/task-layout.tsx/TaskDetailSection';
import { useLocalSearchParams } from 'expo-router';

const WorkspaceTaskDetail = () => {
  const { id, backRoute } = useLocalSearchParams();

  return (
    <>
      <AlertHeader />
      <TaskDetailSection taskId={id as string} backRoute={backRoute as string} />
    </>
  );
};

export default WorkspaceTaskDetail;
