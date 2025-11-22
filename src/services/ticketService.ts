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
