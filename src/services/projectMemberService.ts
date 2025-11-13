import { apiInstance } from '../api/apiInstance';

//https://localhost:7160/api/projectmember/DE562EA1-F67A-45CB-92A1-1199C1BC09E6/FA5AA664-0D66-4620-8FD1-4B42BFC18578
export const getProjectMemberByCompanyIdAndUserId = async (
  companyId: string,
  memberId: string,
  ProjectNameOrCode = '',
  Status = '',
  StartDate = '',
  EndDate = '',
  PageNumber = 1,
  PageSize = 10,
  SortColumn = '',
  SortDescending = null,
) => {
  try {
    const response = await apiInstance.get(`/projectmember/${companyId}/${memberId}`, {
      params: {
        ProjectNameOrCode,
        Status,
        StartDate,
        EndDate,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });
    return response.data;
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

    console.error('Error in getProjectMemberByCompanyIdAndUserId:', error);
    throw new Error((error as any).response?.data?.message || 'Fail!');
  }
};

export const getProjectMemberByProjectId = async (
  projectId: string,
  Keyword = '',
  FromDate = '',
  ToDate = '',
  PageNumber = 1,
  PageSize = 10,
  SortColumn = '',
  SortDescending = null,
) => {
  try {
    const response = await apiInstance.get(`/projectmember/project/${projectId}`, {
      params: {
        Keyword,
        FromDate,
        ToDate,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });
    return response.data;
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

    console.error('Error in getProjectMemberByProjectId:', error);
    throw new Error(error.response?.data?.message || 'Fail!');
  }
};
