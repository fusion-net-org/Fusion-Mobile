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

export const TicketViewModeMap = {
  AsRequester: 0,
  AsExecutor: 1,
};

export interface TicketFilterApi {
  keyword?: string;
  projectId?: string | null;
  companyRequestId?: string | null;
  companyExecutorId?: string | null;
  status?: keyof typeof TicketStatusMap | null;
  viewMode?: keyof typeof TicketViewModeMap | null;
  createdFrom?: string | null;
  createdTo?: string | null;
  isDeleted?: boolean | null;
  pageNumber?: number;
  pageSize?: number;
  sortColumn?: string | null;
  sortDescending?: boolean | null;
}
