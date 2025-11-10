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
  website: string;
  address: string;
  phoneNumber: string;

  createAt: string;
  updateAt: string;

  isOwner: boolean;
  isPartner: boolean;
  isPendingAprovePartner: boolean;

  totalMember: number;
  totalProject: number;
  totalPartners: number;
  totalApproved: number;
  totalWaitForApprove: number;

  totalOngoingProjects: number;
  totalCompletedProjects: number;
  totalClosedProjects: number;
  totalLateProjects: number;
  onTimeRelease: number;
  totalProjectCreated: number;
  totalProjectHired: number;

  totalProjectRequestSent: number;
  totalProjectRequestReceive: number;
  totalProjectRequestAcceptSent: number;
  totalProjectRequestRejectSent: number;
  totalProjectRequestPendingSent: number;
  totalProjectRequestAcceptReceive: number;
  totalProjectRequestRejectReceive: number;
  totalProjectRequestPendingReceive: number;

  companyRoles?: CompanyRole[];
}

export interface CompanyRole {
  roleId: number;
  roleName: string;
  totalMembers: number;
}

export interface CompanyState {
  data: Company[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  filter: CompanyFilter;
  selectedCompany: any | null;
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
