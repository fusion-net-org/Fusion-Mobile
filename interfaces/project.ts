export interface Project {
  id: string;
  name: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  workflow: string;
  ptype: string;
  code: string;
  ownerCompany: string;
  hiredCompany: string;
}

export interface ProjectFilter {
  search?: string;
  sort?: 'recent' | 'start' | 'name';
  status?: string[];
  types?: string[];
}

export interface LoadProjectsParams {
  companyId: string | string[];
  q?: string;
  statuses?: string[];
  sort?: string;
  pageNumber?: number;
  pageSize?: number;
}
