import { StatusCategory } from './base';
import { TaskVm } from './task';

export type StatusMeta = {
  id: string;
  code: string; // "todo" | "inprogress" | ...
  name: string; // label hiển thị
  category: StatusCategory;
  order: number;
  wipLimit?: number;
  color?: string;
  isFinal?: boolean;
  isStart?: boolean;
};

export type SprintVm = {
  id: string;
  name: string;
  start?: string;
  end?: string;
  state?: 'Planning' | 'Active' | 'Closed';
  capacityHours?: number;
  committedPoints?: number;

  workflowId?: string;
  // dynamic:
  statusOrder: string[]; // ["st-todo","st-inp","st-rev","st-done"]
  statusMeta: Record<string, StatusMeta>; // id -> meta
  columns: Record<string, TaskVm[]>; // statusId -> TaskVm[]
};
