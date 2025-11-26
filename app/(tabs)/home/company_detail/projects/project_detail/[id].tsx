// screens/ProjectBoardScreen.tsx
import React from 'react';
import { ActivityIndicator, Text } from 'react-native';

import ProjectBoardInner from '@/components/project-detail-layout/ProjectBoardInner';
import { ProjectBoardProvider } from '@/components/project-detail-layout/ProjectBoardProvider';
import { fetchSprintBoard } from '@/src/services/projectBoardService';
import { normalizeBoardInput } from '@/src/utils/ProjectBoardMapper';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectBoardScreen() {
  const { id } = useLocalSearchParams();
  const projectId = Array.isArray(id) ? id[0] : id;

  if (!id) {
    throw new Error('Project ID is required');
  }

  const [init, setInit] = React.useState<{ sprints: any[]; tasks: any[] } | null>(null);

  React.useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const res = await fetchSprintBoard(projectId as string);
        const normalized = normalizeBoardInput(res ?? {});
        if (!dead) setInit(normalized);
      } catch (err) {
        console.error('Failed to load sprint board', err);
        if (!dead) setInit({ sprints: [], tasks: [] });
      }
    })();
    return () => {
      dead = true;
    };
  }, [projectId]);

  if (!init) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#666' }}>Loading board…</Text>
      </SafeAreaView>
    );
  }

  return (
    <ProjectBoardProvider key={projectId} projectId={projectId} initialData={init}>
      <ProjectBoardInner projectId={projectId} />
    </ProjectBoardProvider>
  );
}
