export interface Company {
  id: string;
  name: string;
  ownerUserId: string;
  ownerUserName: string;
  OwnerUserAvatar: string;
  taxCode: string;
  email: string;
  detail: string;
  imageCompany: string;
  avatarCompany: string;
  createAt: string;
  updateAt: string;
  totalMember: number;
  totalProject: number;
}

export interface CompanyState {
  data: Company[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  filter: CompanyFilter;
  selectedCompany: any | null; // 👈 thêm dòng này
}

export interface CompanyFilter {
  keyword?: string;
  sortColumn?: string;
  sortOrder?: 'ASC' | 'DESC';
  totalProject?: number;
  totalMember?: number;
  relationship?: 'All' | 'Owner' | 'Member';
  pageNumber: number;
  pageSize: number;
}

export interface CompanyFilterApi {
  keyword?: string;
  sortColumn?: string;
  sortOrder?: boolean;
  totalProject?: number;
  totalMember?: number;
  relationship?: number;
  pageNumber: number;
  pageSize: number;
}
