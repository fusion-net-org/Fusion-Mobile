import { PagedResult } from '@/interfaces/base';
import {
  DateFilterType,
  ProjectRequest,
  ProjectRequestFilterApi,
  ProjectRequestViewMode,
} from '@/interfaces/project_request';
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

export const GetProjectRequestByCompanyId = async (
  companyId: string,
  Keyword: string | null = null,
  Status: string | null = null,
  Deleted: boolean | null = null,
  IsHaveProject: boolean | null = null,
  ViewMode: ProjectRequestViewMode | null = null,
  DateFilterTypeParam: DateFilterType | null = null,
  DateRangeFrom: string | null = null,
  DateRangeTo: string | null = null,
  PageNumber: number = 1,
  PageSize: number = 10,
  SortColumn: string | null = null,
  SortDescending: boolean | null = null,
) => {
  try {
    const response = await apiInstance.get(`/projectrequest/paged/${companyId}`, {
      params: {
        Keyword,
        Status,
        Deleted,
        IsHaveProject,
        ViewMode,
        DateFilterType: DateFilterTypeParam,
        'DateRange.From': DateRangeFrom,
        'DateRange.To': DateRangeTo,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });

    return (
      response.data?.data || {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
      }
    );
  } catch (error) {
    console.error('Error in GetProjectRequestByCompanyId:', error);
    return { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 };
  }
};

export const AcceptProjectRequest = async (id: string) => {
  try {
    const response = await apiInstance.post(`/projectrequest/${id}/accept`);
    return response.data;
  } catch (error: any) {
    console.error('Error in AcceptProjectRequest:', error);
    return (
      error.response?.data || {
        succeeded: false,
        message: 'Unexpected error occurred',
      }
    );
  }
};

export const GetProjectRequestById = async (id: string) => {
  try {
    const response = await apiInstance.get(`/projectrequest/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
    return (
      error.response?.data || {
        succeeded: false,
        message: 'Unexpected error occurred',
      }
    );
  }
};

export const RestoreProjectRequest = async (id: string) => {
  try {
    const response = await apiInstance.post(`/projectrequest/${id}/restore`);
    return response.data;
  } catch (error: any) {
    console.error('Error in RestoreProjectRequest:', error);
    return (
      error.response?.data || {
        succeeded: false,
        message: 'Unexpected error occurred',
      }
    );
  }
};

export const RejectProjectRequest = async (id: string, reason = '') => {
  try {
    const response = await apiInstance.post(`/projectrequest/${id}/reject`, null, {
      params: { reason },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error in RejectProjectRequest:', error);
    return (
      error.response?.data || {
        succeeded: false,
        message: 'Unexpected error occurred',
      }
    );
  }
};
