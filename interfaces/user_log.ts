export interface UserLogResponse {
  id: string;
  actorUserId: string;
  title: string;
  description: string;
  createdAt: string;
  updateAt: string;
  isDeleted: boolean;
}

export interface UserLogSearchRequest {
  keyword?: string;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDescending?: boolean;
}
