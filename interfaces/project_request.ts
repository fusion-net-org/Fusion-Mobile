import { DateRange } from '@/types/date/date';

export interface ProjectRequest {
  id: string;
  requesterCompanyId: string;
  requesterCompanyName: string;
  executorCompanyId: string;
  executorCompanyName: string;
  createdBy: string;
  createdName: string;
  code: string;
  projectName: string;
  description: string;
  status: string;
  isDeleted: boolean;
  startDate: string;
  endDate: string;
  createAt: string;
  updateAt: string;
  isHaveProject: boolean;
  convertedProjectId: string;
}

export interface ProjectRequestState {
  data: ProjectRequest[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  filter: ProjectRequestFilter;
}

export interface ProjectRequestFilter {
  partnerId?: string;
  keyword?: string;
  sortOrder?: 'ASC' | 'DESC';
  sortColumn?: string;
  status?: 'Pending' | 'Accepted' | 'Rejected' | 'Finished' | 'All';
  viewMode?: 'Requester' | 'Executor' | 'Both';
  dateRange?: DateRange;
  dateFilterType?: 'Created' | 'Start - End' | 'Approved' | 'Rejected' | 'Pending' | 'All';
  pageNumber: number;
  pageSize: number;
}

export interface ProjectRequestFilterApi {
  partnerId?: string;
  keyword?: string;
  sortOrder?: boolean;
  sortColumn?: string;
  status?: number;
  viewMode?: number;
  dateFilterType?: number;
  dateRange?: DateRange;
  pageNumber: number;
  pageSize: number;
}
