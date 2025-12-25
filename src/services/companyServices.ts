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

export const getAllCompanies = async (
  keyword = '',
  ownerUserName = '',
  relationShipEnums = '',
  DayFrom: Date | null = null,
  DayTo: Date | null = null,
  pageNumber = 1,
  pageSize = 25,
  SortColumn = null,
  SortDescending: boolean | null = null,
  companyId = '',
) => {
  try {
    const params = new URLSearchParams();

    if (keyword && keyword.trim()) params.append('Keyword', encodeURIComponent(keyword.trim()));
    if (ownerUserName && ownerUserName.trim())
      params.append('OwnerUserName', encodeURIComponent(ownerUserName.trim()));
    if (relationShipEnums && typeof relationShipEnums === 'string' && relationShipEnums.trim()) {
      params.append('RelationShipEnums', relationShipEnums.trim());
    }
    if (DayFrom) params.append('DayFrom', DayFrom.toString());
    if (DayTo) params.append('DayTo', DayTo.toString());
    if (companyId && companyId.trim()) params.append('companyId', companyId);
    if (SortColumn) params.append('SortColumn', SortColumn);
    if (typeof SortDescending === 'boolean')
      params.append('SortDescending', SortDescending.toString());
    params.append('PageNumber', pageNumber.toString());
    params.append('PageSize', pageSize.toString());

    const queryString = params.toString().replace(/%25/g, '%');

    const response = await apiInstance.get(`/company/all-companies?${queryString}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    throw new Error(error.response?.data?.message || 'Error fetching companies!');
  }
};
