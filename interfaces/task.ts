import { StatusCategory } from './base';

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
  workflowStatusId: string; // FK
  statusCode: string; // tiện màu sắc/icon
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
