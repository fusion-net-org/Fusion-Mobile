import { PagedResult } from '@/interfaces/base';
import { Company, CompanyFilterApi } from '@/interfaces/company';
import { apiInstance } from '../api/apiInstance';

export const GetPagedCompanies = async (
  filter: CompanyFilterApi,
): Promise<PagedResult<Company>> => {
  try {
    const response = await apiInstance.get(`/company/paged`, {
      params: {
        keyword: filter.keyword,
        sortColumn: filter.sortColumn,
        sortDescending: filter.sortOrder,
        totalProject: filter.totalProject,
        totalMember: filter.totalMember,
        RelationShipEnums: filter.relationship,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });

    if (response.data?.statusCode === 200) {
      return response.data.data as PagedResult<Company>;
    } else {
      throw new Error(response.data?.message || 'Fetch paged companies failed');
    }
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      } as PagedResult<Company>;
    }

    console.error('Fetch paged companies error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Fetch paged companies failed';
    throw new Error(message);
  }
};

export const GetCompanyById = async (companyId: string): Promise<Company> => {
  try {
    const response = await apiInstance.get(`/company/${companyId}`);
    if (response.data?.statusCode === 200) {
      return response.data.data as Company;
    } else {
      throw new Error(response.data?.message || 'Fetch company failed');
    }
  } catch (error: any) {
    console.error('Fetch company error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch company failed';
    throw new Error(message);
  }
};

export const AllActivityLogCompanyById = async (
  companyId: string,
  Keyword: string | null = null,
  From = null,
  To = null,
  PageNumber = 1,
  PageSize = 25,
  SortColumn = null,
  SortDescending = null,
) => {
  try {
    const response = await apiInstance.get(`/CompanyActivityLogs`, {
      params: {
        companyId,
        Keyword,
        From,
        To,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
