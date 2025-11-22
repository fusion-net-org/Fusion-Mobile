import { PagedResult } from '@/interfaces/base';
import { ProjectRequest, ProjectRequestFilterApi } from '@/interfaces/project_request';
import { apiInstance } from '../api/apiInstance';
import { formatLocalDate } from './../utils/formatLocalDate';

export const GetProjectRequestPartnerPaged = async (
  filter: ProjectRequestFilterApi,
  companyId: string,
): Promise<PagedResult<ProjectRequest>> => {
  try {
    const params = Object.fromEntries(
      Object.entries({
        keyword: filter.keyword,
        sortColumn: filter.sortColumn,
        sortDescending: filter.sortOrder,
        status: filter.status,
        viewMode: filter.viewMode,
        dateFilterType: filter.dateFilterType,
      }).filter(([_, v]) => v !== undefined && v !== null),
    );

    if (filter.dateRange !== undefined) {
      console.log('eneter');
      if (filter.dateRange?.from && filter.dateRange?.to) {
        params['dateRange.from'] = formatLocalDate(filter.dateRange.from).split('T')[0];
        params['dateRange.to'] = formatLocalDate(filter.dateRange.to).split('T')[0];
      }
    }

    const response = await apiInstance.get(
      `projectrequest/companies/${companyId}/partners/${filter.partnerId}`,
      { params },
    );

    //Kiểm tra statusCode trả về
    if (response.data?.statusCode === 200) {
      return response.data.data as PagedResult<ProjectRequest>;
    } else {
      throw new Error(response.data?.message || 'Fetch paged project request failed');
    }
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 404) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      } as PagedResult<ProjectRequest>;
    }

    console.error('❌ Fetch paged project request error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Fetch paged companies failed';
    throw new Error(message);
  }
};
