import { PagedResult } from '@/interfaces/base';
import { MemberFilterAPI, MemberItem } from '@/interfaces/member';
import { apiInstance } from '../api/apiInstance';

export const GetPageMemberInCompany = async (
  companyId: string,
  filter: MemberFilterAPI,
): Promise<PagedResult<MemberItem>> => {
  try {
    const response = await apiInstance.get(`/companymember/paged/${companyId}`, {
      params: {
        memberName: filter.memberName,
        sortColumn: filter.sortColumn,
        sortDescending: filter.sortOrder,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
        'DateRange.From': filter.fromDate || null,
        'DateRange.To': filter.toDate || null,
      },
    });
    if (response.data?.statusCode === 200) {
      return response.data.data as PagedResult<MemberItem>;
    } else {
      throw new Error(response.data?.message || 'Fetch list Members failed');
    }
  } catch (error: any) {
    console.error('❌ Fetch list Members error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch List Members failed';
    throw new Error(message);
  }
};
