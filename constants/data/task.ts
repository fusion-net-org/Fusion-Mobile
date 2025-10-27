// src/mocks/taskData.ts
export const mockTasks = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Resolve OAuth issue on Android app',
    priority: 'High',
    status: 'InProgress',
    dueDate: '2025-10-27',
    assignee: 'Minh Nguyen',
    project: 'Fusion App',
  },
  {
    id: '2',
    title: 'Design homepage UI',
    description: 'Redesign layout according to new brand guide',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2025-10-28',
    assignee: 'An Le',
    project: 'Fusion Website',
  },
  {
    id: '3',
    title: 'Write API docs',
    description: 'Document all new endpoints for v2 release',
    priority: 'Low',
    status: 'Done',
    dueDate: '2025-10-29',
    assignee: 'Phuc Tran',
    project: 'Fusion Backend',
  },
];
