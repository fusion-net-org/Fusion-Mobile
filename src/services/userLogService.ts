import { PagedResult } from '@/interfaces/base';
import { UserLogResponse, UserLogSearchRequest } from '@/interfaces/user_log';
import { apiInstance } from '../api/apiInstance';

export const GetUserLogByUserIdAsync = async (
  actorUserId: string,
  filter: UserLogSearchRequest,
): Promise<PagedResult<UserLogResponse>> => {
  try {
    const response = await apiInstance.get(`User/log`, {
      params: {
        keyword: filter.keyword,
        sortColumn: filter.sortColumn,
        sortDescending: filter.sortDescending,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
        'DateRange.From': filter.fromDate || null,
        'DateRange.To': filter.toDate || null,
      },
    });
    if (response.data?.statusCode === 200) {
      return response.data.data as PagedResult<UserLogResponse>;
    } else {
      throw new Error(response.data?.message || 'Fetch list User Log failed');
    }
  } catch (error: any) {
    console.error('❌ Fetch list User Log error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch List User Log failed';
    throw new Error(message);
  }
};
