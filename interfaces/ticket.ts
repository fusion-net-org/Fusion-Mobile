export interface Ticket {
  id: string;
  projectId: string;
  priority?: string;
  urgency?: string;
  isHighestUrgen?: boolean;
  ticketName?: string;
  description?: string;
  statusId?: string;
  submittedBy?: string;
  submittedByName?: string;
  isBillable?: boolean;
  budget?: number;
  isDeleted?: boolean;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PagedTickets {
  items: Ticket[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface TicketResponse {
  succeeded: boolean;
  statusCode: number;
  message: string;
  data: PagedTickets;
}

export const TicketStatusMap = {
  Pending: 0,
  Accepted: 1,
  Rejected: 2,
  Finished: 3,
};

export type TicketViewModeMap = 'AsRequester' | 'AsExecutor';

export interface TicketFilterApi {
  keyword?: string;
  projectId?: string | null;
  companyRequestId?: string | null;
  companyExecutorId?: string | null;
  status?: keyof typeof TicketStatusMap | null;
  viewMode?: TicketViewModeMap | null;
  createdFrom?: string | null;
  createdTo?: string | null;
  isDeleted?: boolean | null;
  pageNumber?: number;
  pageSize?: number;
  sortColumn?: string | null;
  sortDescending?: boolean | null;
}

export interface TicketItem {
  id: string;
  ticketName: string;
  projectName: string;
  createdAt: string;
  priority: string;
  status: string;
  budget?: number;
  isDeleted: boolean;
}
