// src/services/projectService.ts
import { LoadProjectsParams } from '@/interfaces/project';
import { apiInstance } from '../api/apiInstance';

export async function loadProjects({
  companyId,
  q,
  statuses = [],
  sort = 'recent',
  pageNumber = 1,
  pageSize = 50,
}: LoadProjectsParams) {
  if (!companyId) throw new Error('companyId is required');

  const params = { q, sort, pageNumber, pageSize };

  const paramsSerializer = (p: Record<string, any>) => {
    const usp = new URLSearchParams();
    Object.entries(p).forEach(([key, value]) => {
      if (value == null || value === '') return;
      if (Array.isArray(value)) value.forEach((v) => usp.append(key, v));
      else usp.append(key, String(value));
    });
    statuses.forEach((s) => usp.append('statuses', s));
    return usp.toString();
  };

  try {
    const { data } = await apiInstance.get(`/companies/${companyId}/projects`, {
      params,
      paramsSerializer,
    });
    console.log(data);
    return data;
  } catch (err: any) {
    console.log('API ERROR:', err?.response?.data || err.message);
    throw err;
  }
}
