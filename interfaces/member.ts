import { DateRange } from '@/types/date/date';

export interface MemberItem {
  id: string;
  companyId: string;
  memberId: string;
  role: MemberRoleItem;
  memberName: string;
  memberAvatar: string;
  memberPhoneNumber: string;
  numberProductJoin: number;
  numberCompanyJoin: number;
  status: string;
  joinedAt: string;
  isOwner: string;
}

export interface MemberRoleItem {
  roleId: number;
  roleName: string;
}

export interface MemberFilter {
  memberName?: string;
  dateRange?: DateRange;
  pageNumber: number;
  pageSize: number;
  sortOrder?: 'ASC' | 'DESC';
  sortColumn?: string;
}

export interface MemberFilterAPI {
  memberName?: string;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber: number;
  pageSize: number;
  sortOrder?: boolean;
  sortColumn?: string;
}

export interface MemberState {
  data: MemberItem[];
  totalCount: number;
  filter: MemberFilter;
  loading: boolean;
  error: string | null;
  selectedMember?: any | null;
  statusSummary: MemberStatusSummary | null;
  statusLoading?: boolean;
}

export interface MemberStatusSummary {
  active: number;
  pending: number;
  inactive: number;
  total: number;
}
