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
