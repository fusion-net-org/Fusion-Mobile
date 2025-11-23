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

export interface ProjectInfo {
  id: string;
  companyId: string;
  isHired: boolean;
  companyHiredId: string;
  projectRequestId: string;
  code: string;
  name: string;
  description: string;
  status: string;
  workflowId: string;
  workflowName: string;
  startDate: string;
  endDate: string;
  createAt: string;
  updateAt: string;
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
