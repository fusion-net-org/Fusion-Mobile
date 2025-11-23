export interface Workflow {
  id: string;
  name: string;
  statuses: StatusPreview[];
  transitions: TransitionPreview[];
  ptype?: string;
}

export type StatusPreview = {
  id: string;
  name: string;
  isStart: boolean;
  isEnd: boolean;
  x: number;
  y: number;
  color?: string | null;
  roles?: string[];
};
export type TransitionPreview = {
  fromStatusId: string;
  toStatusId: string;
  type: TransitionType;
  label?: string | null;
};

export type TransitionType = 'success' | 'failure' | 'optional';

export interface WorkflowStatusInfo {
  id: string;
  workflowId: string;
  name: string;
  position: number;
  isStart: boolean;
  isEnd: boolean;
  guardNameKey: string;
}
