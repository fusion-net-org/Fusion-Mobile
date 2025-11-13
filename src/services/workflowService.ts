import { Workflow } from '@/interfaces/workflow';
import { apiInstance } from '../api/apiInstance';

export const getWorkflows = async (companyId: string): Promise<Workflow[]> => {
  try {
    const res = await apiInstance.get(`/companies/${companyId}/workflows`);
    return res.data.data || [];
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 404) {
      return {
        items: [],
      } as any;
    }

    console.error('Cannot load workflows', error);
    return [];
  }
};

export const getWorkflowPreviews = async (companyId: string): Promise<Workflow[]> => {
  try {
    const res = await apiInstance.get(`/companies/${companyId}/workflows/previews`);
    return res.data?.data ?? [];
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 404) {
      return {
        items: [],
      } as any;
    }
    console.error('Cannot load workflows', error);
    return [];
  }
};
