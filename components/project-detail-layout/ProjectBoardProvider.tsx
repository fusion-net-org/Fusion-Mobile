import { SprintVm } from '@/interfaces/sprint';
import { TaskVm } from '@/interfaces/task';
import { ProjectBoardContext, useProjectBoardProviderLogic } from '@/src/utils/ProjectBoardContext';

export function ProjectBoardProvider({
  projectId,
  initialData,
  children,
}: {
  projectId: string;
  initialData?: { sprints: SprintVm[]; tasks: TaskVm[] };
  children: React.ReactNode;
}) {
  const value = useProjectBoardProviderLogic(projectId, initialData);
  return <ProjectBoardContext.Provider value={value}>{children}</ProjectBoardContext.Provider>;
}
