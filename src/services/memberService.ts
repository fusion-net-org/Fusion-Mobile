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
        keyword: filter.memberName,
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
    console.error('Fetch list Members error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch List Members failed';
    throw new Error(message);
  }
};

export const GetCompanyMemberByCompanyIdAndUserId = async (
  companyId: string,
  userId: string,
): Promise<any> => {
  try {
    const response = await apiInstance.get(`/companymember/member/${companyId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error inviting member:', error);
    throw new Error((error as any).response?.data?.message || 'Failed to invite member');
  }
};

export const AcceptJoinMemberById = async (memberId: number) => {
  try {
    const response = await apiInstance.put(`/companymember/${memberId}/accept`);
    return response.data;
  } catch (error: any) {
    console.error('Error accepting member:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to accept member');
  }
};

export const RejectJoinMemberById = async (memberId: number) => {
  try {
    const response = await apiInstance.put(`/companymember/${memberId}/reject`);
    return response.data;
  } catch (error: any) {
    console.error('Error rejecting member:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to reject member');
  }
};

export const GetCompanyMemberByUserId = async (
  KeyWord = '',
  status?: 'Pending' | 'Active' | 'Inactive' | null,
  CreateAtFrom = null,
  CreateAtTo = null,
  JoinedAtFrom = null,
  JoinedAtTo = null,
  CompanyName = null,
  MemberName = null,
  PageNumber = 1,
  PageSize = 10,
  SortColumn: string | null = null,
  SortDescending: boolean | null = null,
) => {
  try {
    const response = await apiInstance.get(`/companymember/by-user`, {
      params: {
        KeyWord: KeyWord,
        Status: status,

        'CreateAtRange.From': CreateAtFrom,
        'CreateAtRange.To': CreateAtTo,

        'JoinedAtRange.From': JoinedAtFrom,
        'JoinedAtRange.To': JoinedAtTo,

        CompanyName: CompanyName,
        MemberName: MemberName,

        PageNumber: PageNumber,
        PageSize: PageSize,

        SortColumn: SortColumn,
        SortDescending: SortDescending,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error in GetCompanyMemberByUserId:', error);
    throw new Error(error.response?.data?.message || 'Fail!');
  }
};
