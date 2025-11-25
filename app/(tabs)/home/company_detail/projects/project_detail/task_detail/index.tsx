import TaskDetailSection from '@/components/task-layout.tsx/TaskDetailSection';
import { useLocalSearchParams } from 'expo-router';

const TaskDetail = () => {
  const { id } = useLocalSearchParams();
  const { backRoute } = useLocalSearchParams();
  return <TaskDetailSection taskId={id as string} backRoute={backRoute as string} />;
};

export default TaskDetail;
