import { StatusCategory } from './base';
import { TaskMember } from './member';
import { ProjectInfo } from './project';
import { SprintInfo } from './sprint';
import { TaskComment } from './task_comment';
import { WorkflowStatusInfo } from './workflow';

export type MemberRef = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export type TaskVm = {
  id: string;
  code: string;
  title: string;
  type: 'Feature' | 'Bug' | 'Chore' | string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  storyPoints?: number;
  estimateHours?: number;
  remainingHours?: number;
  dueDate?: string;

  sprintId: string | null;
  workflowStatusId: string;
  statusCode: string;
  statusCategory: StatusCategory;
  assignees: MemberRef[];
  dependsOn: string[];
  parentTaskId: string | null;
  carryOverCount: number;
  StatusName: string;
  openedAt: string;
  updatedAt: string;
  createdAt: string;

  sourceTicketId: string | null;
  sourceTicketCode: string | null;
};

export interface TaskFilterApi {
  type?: number;
  priority?: number;
  keyword?: string;
  projectId?: string;
  sprintId?: string;
  statusId?: string;
  overDue?: boolean;
  fromDate?: string | null;
  toDate?: string | null;
  pageNumber: number;
  pageSize: number;
  sortOrder?: boolean;
  sortColumn?: string;
}

export interface TaskItem {
  taskId: string;
  code: string;
  title: string;
  img: string;
  type: string;
  priority: string;
  severity: string;
  status: string;
  point: number;
  estimateHours: number;
  remainingHours: number;
  carryOverCount: number;
  orderInSprint: number;
  isBacklog: boolean;
  createAt: string;
  dueDate: string;
  createByName: string;
  createBy: string;
  parentTaskId: string | null;
  sourceTaskId: string | null;

  project?: ProjectInfo;
  sprint?: SprintInfo;
  workflowStatus?: WorkflowStatusInfo;

  members: TaskMember[];
  checklist: TaskChecklistItem[];
  dependencies: TaskDependency[];
  comments: TaskComment[];
}

export interface TaskChecklistItem {
  id: string;
  taskId: string;
  label: string;
  isDone: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface TaskDependency {
  taskId: string;
  title: string;
  code: string;
  priority: string;
  status: string;
  point: number;
  estimateHours: number;
}
