export interface PartnerItem {
  companyId: string;
  name: string;
  taxCode: string;
  ownerUserName: string;
  respondedAt: string;
  createdAt: string;
  totalProject: number;
}

export interface PartnerFilter {
  keyword?: string;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber: number;
  pageSize: number;
  sortOrder?: 'ASC' | 'DESC';
  sortColumn?: string;
}

export interface PartnerFilterAPI {
  keyword?: string;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber: number;
  pageSize: number;
  sortOrder?: boolean;
  sortColumn?: string;
}

export interface PartnerState {
  data: PartnerItem[];
  totalCount: number;
  filter: PartnerFilter;
  loading: boolean;
  error: string | null;
  selectedPartner?: any | null;
  statusSummary: PartnerStatusSummary | null;
  statusLoading?: boolean;
}

export interface PartnerStatusSummary {
  active: number;
  pending: number;
  inactive: number;
  total: number;
}
