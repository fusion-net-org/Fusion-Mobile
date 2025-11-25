import { PagedResult } from '@/interfaces/base';
import { TaskFilterApi, TaskItem } from '@/interfaces/task';
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

    console.error('Fetch task failed:', error.response?.data?.message || error.message);
    return null;
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
