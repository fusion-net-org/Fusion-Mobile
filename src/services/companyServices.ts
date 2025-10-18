// src/services/companyService.ts
import { PagedResult } from '@/interfaces/base';
import { Company, CompanyFilterApi } from '@/interfaces/company';
import { apiInstance } from '../api/apiInstance';

export const GetPagedCompanies = async (
  filter: CompanyFilterApi,
): Promise<PagedResult<Company>> => {
  try {
    console.log('📤 Fetching paged companies with filter:', filter);

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

    // ✅ Kiểm tra statusCode trả về
    if (response.data?.statusCode === 200) {
      return response.data.data as PagedResult<Company>;
    } else {
      throw new Error(response.data?.message || 'Fetch paged companies failed');
    }
  } catch (error: any) {
    const status = error.response?.status;

    // 🚫 Nếu là 404 => không log đỏ, chỉ trả về rỗng
    if (status === 404) {
      console.log('ℹ️ No companies found (404)');
      return {
        items: [],
        totalCount: 0,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      } as PagedResult<Company>;
    }

    console.error('❌ Fetch paged companies error:', error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Fetch paged companies failed';
    throw new Error(message);
  }
};
