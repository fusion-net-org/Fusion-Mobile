export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export type StatusCategory = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface FilterItem {
  id: string;
  name: string;
}
