import { PagedResult } from '@/interfaces/base';
import {
  PartnerFilterAPI,
  PartnerItem,
  PartnerStatusSummary,
  PartnerTaskStats,
} from '@/interfaces/partner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiInstance } from '../api/apiInstance';

export const GetPagePartner = async (
  companyId: string,
  filter: PartnerFilterAPI,
): Promise<PagedResult<PartnerItem>> => {
  try {
    const response = await apiInstance.get(`/partners/paged/${companyId}`, {
      params: {
        keyword: filter.keyword,
        sortColumn: filter.sortColumn,
        sortDescending: filter.sortOrder,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
        fromDate: filter.fromDate,
        toDate: filter.toDate,
      },
    });

    if (response.data?.statusCode === 200) {
      return response.data.data as PagedResult<PartnerItem>;
    } else {
      throw new Error(response.data?.message || 'Fetch list partners failed');
    }
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      } as any;
    }

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch list partners failed';
    throw new Error(message);
  }
};

export const GetPartnerStatusSummary = async (companyId: string): Promise<PartnerStatusSummary> => {
  try {
    const response = await apiInstance.get(`/partners/status-summary/${companyId}`);
    if (response.data?.statusCode === 200) {
      return response.data.data as PartnerStatusSummary;
    } else {
      throw new Error(response.data?.message || 'Fetch list partners failed');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch notifications failed';
    throw new Error(message);
  }
};

export const GetPartnerTaskStats = async (partnerId?: string): Promise<PartnerTaskStats | null> => {
  if (!partnerId) return null;

  try {
    const storedCompany = await AsyncStorage.getItem('selectedCompany');
    if (!storedCompany) return null;

    const company = JSON.parse(storedCompany);
    const myCompanyId = company.id;

    const response = await apiInstance.get(
      `/partners/task-stats?PartnerCompanyId=${partnerId}&MyCompanyId=${myCompanyId}`,
    );

    return response.data.data as PartnerTaskStats;
  } catch (error) {
    console.error('Failed to fetch performance data:', error);
    return null;
  }
};
