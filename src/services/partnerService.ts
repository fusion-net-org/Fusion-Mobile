import { PagedResult } from '@/interfaces/base';
import { PartnerFilterAPI, PartnerItem, PartnerStatusSummary } from '@/interfaces/partner';
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
    console.error('❌ Fetch list partners error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch list partners failed';
    throw new Error(message);
  }
};

export const GetPartnerStatusSummary = async (companyId: string): Promise<PartnerStatusSummary> => {
  try {
    const response = await apiInstance.get(`/partners/status-summary/${companyId}`);
    if (response.data?.statusCode === 200) {
      console.log(response.data.data);
      return response.data.data as PartnerStatusSummary;
    } else {
      throw new Error(response.data?.message || 'Fetch list partners failed');
    }
  } catch (error: any) {
    console.error('❌ Fetch list partners error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch notifications failed';
    throw new Error(message);
  }
};
