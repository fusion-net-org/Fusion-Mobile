import { PagedResult } from '@/interfaces/base';
import { TaskFilterApi, TaskItem, TaskSubItem } from '@/interfaces/task';
import Toast from 'react-native-toast-message';
import { apiInstance } from '../api/apiInstance';

export const GetTaskBySprintId = async (
  sprintId: string,
  Title = '',
  Status = '',
  Priority = '',
  CreatedFrom = '',
  CreatedTo = '',
  PageNumber = 1,
  PageSize = 10,
  SortColumn = '',
  SortDescending = null,
) => {
  try {
    const response = await apiInstance.get(`/sprints/${sprintId}/tasks`, {
      params: {
        Title,
        Status,
        Priority,
        CreatedFrom,
        CreatedTo,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error in GetTaskBySprintId:', error);
    throw new Error(error.response?.data?.message || 'Fail!');
  }
};

export const GetDetailTasksByUserId = async (taskId: string): Promise<TaskItem | null> => {
  try {
    const response = await apiInstance.get(`/tasks/detail/${taskId}`);

    if (response.data?.statusCode === 200) {
      return response.data.data as TaskItem;
    } else {
      Toast.show({
        type: 'info',
        text1: 'Fetch Task Warning',
        text2: response.data?.message || 'Unknown warning',
      });
      return null;
    }
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404) {
      return null;
    }
    console.log(error.response?.data?.message);
    console.error('Fetch task failed:', error.response?.data?.message || error.message);
    return null;
  }
};

export const getTaskById = async (id: string) => {
  try {
    const response = await apiInstance.get(`/tasks/${id}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error!';
    throw new Error(message);
  }
};

export const GetPageTasksByUserId = async (
  filter: TaskFilterApi,
): Promise<PagedResult<TaskItem>> => {
  try {
    const response = await apiInstance.get(`/tasks/user`, {
      params: {
        type: filter.type,
        priority: filter.priority,
        keyword: filter.keyword,
        projectId: filter.projectId,
        sprintId: filter.sprintId,
        statusId: filter.statusId,
        overDue: filter.overDue,
        sortColumn: filter.sortColumn,
        sortDescending: filter.sortOrder,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
        'DateRange.From': filter.fromDate || null,
        'DateRange.To': filter.toDate || null,
      },
    });

    if (response.data?.statusCode === 200) {
      return response.data.data as PagedResult<TaskItem>;
    } else {
      return response.data?.message;
    }
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      } as any;
    }

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch list Task failed';
    return message;
  }
};

export const patchTaskStatusById = async (
  taskId: string,
  statusId: string,
  { flashColorHex }: any = {},
) => {
  try {
    const res = await apiInstance.patch(`/tasks/${taskId}/status-id`, { statusId });
    const dto = res?.data?.data ?? res?.data;
    return dto;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Change status failed');
  }
};

export const putReorderTask = async (
  projectId: string,
  sprintId: string,
  { taskId, toStatusId, toIndex }: any,
  { flashColorHex }: any = {},
) => {
  try {
    console.log('reOrder');
    const res = await apiInstance.put(`/projects/${projectId}/sprints/${sprintId}/tasks/reorder`, {
      taskId,
      toStatusId,
      toIndex,
    });
    const dto = res?.data?.data ?? res?.data;

    return dto;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Reorder failed');
  }
};

export const postMoveTask = async (
  taskId: string,
  toSprintId: string,
  { flashColorHex }: any = {},
) => {
  try {
    const res = await apiInstance.post(`/tasks/${taskId}/move`, { toSprintId });
    const dto = res?.data?.data ?? res?.data;
    return dto;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Move to sprint failed');
  }
};

export const postTaskMarkDone = async (taskId: string, { flashColorHex }: any = {}) => {
  try {
    const res = await apiInstance.post(`/tasks/${taskId}/mark-done`);
    const dto = res?.data?.data ?? res?.data;
    return dto;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Mark done failed');
  }
};

export const postTaskSplit = async (
  taskId: string,
  { flashColorHexA, flashColorHexB }: any = {},
) => {
  try {
    const res = await apiInstance.post(`/tasks/${taskId}/split`);
    const dto = res?.data?.data ?? res?.data;

    return dto;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Split failed');
  }
};

export const GetSubTasksByTaskId = async (taskId: string): Promise<TaskSubItem[]> => {
  try {
    const response = await apiInstance.get(`/tasks/${taskId}/subtasks`);
    const subTasks = response.data?.data || [];

    console.log(subTasks, 'SubSDAATA');
    return subTasks || [];
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404) {
      // Toast.show({
      //   type: 'error',
      //   text1: 'SubTask not exited',
      //   position: 'top',
      //   visibilityTime: 2000,
      // });
    }

    return [];
  }
};

export const markChecklistDone = async (taskId: string, checklistId: string) => {
  const response = await apiInstance.patch(`tasks/${taskId}/checklist/${checklistId}/done`, {
    isDone: true,
  });
  return response.data;
};

export const getTicketTasks = async (
  ticketId: string,
  { pageNumber = 1, pageSize = 50, sortColumn = 'CreateAt', sortDescending = false } = {},
) => {
  try {
    if (!ticketId) {
      throw new Error('ticketId is required to load ticket tasks');
    }

    const params = {
      PageNumber: pageNumber,
      PageSize: pageSize,
      SortColumn: sortColumn,
      SortDescending: sortDescending,
    };

    const res = await apiInstance.get(`/tickets/${ticketId}/tasks`, {
      params,
    });

    return res?.data?.data ?? res?.data;
  } catch (error: any) {
    console.error('Error in getTicketTasks:', error);
    throw new Error(error?.response?.data?.message || 'Error fetching ticket tasks');
  }
};
