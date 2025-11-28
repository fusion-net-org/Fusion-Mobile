import ProjectDetailRequestSection from '@/components/project_detail_request-layout/ProjectRequestSection';
import { ROUTES } from '@/routes/route';
import { useLocalSearchParams } from 'expo-router';

const ProjectDetailRequest = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  return (
    <>
      <ProjectDetailRequestSection
        projectId={projectId as string}
        backRoute={ROUTES.COMPANY.PROJECTS as string}
      />
    </>
  );
};

export default ProjectDetailRequest;
