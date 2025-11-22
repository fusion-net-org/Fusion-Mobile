import { apiInstance } from '../api/apiInstance';

export const getSprintByProjectId = async (projectId: string) => {
  try {
    const response = await apiInstance.get(`/sprints/projects/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error in getSprintByProjectId:', error);
    throw new Error(error.response?.data?.message || 'Fail!');
  }
};
