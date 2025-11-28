import ProjectRequestWithDetailSection from '@/components/project-request-detail-layout/ProjectRequestDetailSection';
import { ROUTES } from '@/routes/route';
import { useLocalSearchParams } from 'expo-router';

const ProjectRequestDetailPage = () => {
  const { id, companyId } = useLocalSearchParams<{ id: string; companyId: string }>();

  return (
    <>
      <ProjectRequestWithDetailSection
        projectRequestId={id as string}
        companyId={companyId as string}
        backRoute={ROUTES.COMPANY.PROJECT_REQUESTS as string}
      />
    </>
  );
};

export default ProjectRequestDetailPage;
