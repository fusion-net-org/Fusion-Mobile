import { TicketFilterApi, TicketStatusMap } from '@/interfaces/ticket';
import { apiInstance } from '../api/apiInstance';

export const GetTicketByProjectId = async (
  ProjectId: string,
  TicketName = '',
  Priority = '',
  MinBudget = '',
  MaxBudget = '',
  ResolvedFrom = '',
  ResolvedTo = '',
  ClosedFrom = '',
  ClosedTo = '',
  CreateFrom = '',
  CreateTo = '',
  PageNumber = 1,
  PageSize = 10,
  SortColumn = '',
  SortDescending = null,
) => {
  try {
    const res = await apiInstance.get(`/ticket/by-project`, {
      params: {
        ProjectId,
        TicketName,
        Priority,
        MinBudget,
        MaxBudget,
        ResolvedFrom,
        ResolvedTo,
        ClosedFrom,
        ClosedTo,
        CreateFrom,
        CreateTo,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });
    return res.data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 404) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: PageNumber,
        pageSize: PageSize,
      } as any;
    }

    throw error;
  }
};

export const GetTicketById = async (ticketId: string) => {
  try {
    const res = await apiInstance.get(`/ticket/${ticketId}`);
    return res.data;
  } catch (error) {
    console.error('Get ticket by ID error:', error);
    throw error;
  }
};

export const GetTicketPaged = async (filter: TicketFilterApi) => {
  try {
    const params = Object.fromEntries(
      Object.entries({
        Keyword: filter.keyword,
        ProjectId: filter.projectId,
        CompanyRequestId: filter.companyRequestId,
        CompanyExecutorId: filter.companyExecutorId,

        Status: filter.status ? TicketStatusMap[filter.status] : null,
        ViewMode: filter.viewMode,

        CreatedFrom: filter.createdFrom,
        CreatedTo: filter.createdTo,
        IsDeleted: filter.isDeleted,

        PageNumber: filter.pageNumber ?? 1,
        PageSize: filter.pageSize ?? 10,

        SortColumn: filter.sortColumn,
        SortDescending: filter.sortDescending,
      }).filter(([_, v]) => v !== undefined && v !== null && v !== ''),
    );

    const response = await apiInstance.get(`/ticket/paged`, { params });

    console.log(response.data.data);

    if (response.data?.statusCode === 200) {
      return response.data.data;
    }

    throw new Error(response.data?.message || 'Fetch paged tickets failed');
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 404) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: filter.pageNumber ?? 1,
        pageSize: filter.pageSize ?? 10,
      };
    }

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch paged tickets failed';

    throw new Error(message);
  }
};

export const AcceptTicket = async (ticketId: string) => {
  try {
    const res = await apiInstance.put(`/ticket/${ticketId}/accept`);
    return res.data;
  } catch (error) {
    console.error('Accept ticket error:', error);
    throw error;
  }
};

export const RejectTicket = async (ticketId: string, reason = '') => {
  try {
    const res = await apiInstance.put(`/ticket/${ticketId}/reject`, null, {
      params: { reason },
    });
    return res.data;
  } catch (error) {
    console.error('Reject ticket error:', error);
    throw error;
  }
};

export const GetProjectsByCompany = async (
  companyId: string,
  companyRequestId: string | null = null,
  executorCompanyId: string | null = null,
) => {
  try {
    const params: any = { companyId }; // FIX: make params dynamic

    if (companyRequestId) params.companyRequestId = companyRequestId;
    if (executorCompanyId) params.executorCompanyId = executorCompanyId;

    const res = await apiInstance.get('/companies/projects-by-company', {
      params,
    });

    return res.data;
  } catch (error) {
    console.error('Get projects by company error:', error);
    throw error;
  }
};
