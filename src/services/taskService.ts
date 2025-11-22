import { apiInstance } from '../api/apiInstance';
import { flashTaskCard } from '../utils/flash';

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

export const patchTaskStatusById = async (
  taskId: string,
  statusId: string,
  { flashColorHex }: any = {},
) => {
  try {
    const res = await apiInstance.patch(`/tasks/${taskId}/status-id`, { statusId });
    // ResponseModel => lấy data
    const dto = res?.data?.data ?? res?.data;
    // Flash tại DOM card
    flashTaskCard(taskId, { colorHex: flashColorHex });
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
    const res = await apiInstance.put(`/projects/${projectId}/sprints/${sprintId}/tasks/reorder`, {
      taskId,
      toStatusId,
      toIndex,
    });
    const dto = res?.data?.data ?? res?.data;
    flashTaskCard(taskId, { colorHex: flashColorHex });
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
    flashTaskCard(taskId, { colorHex: flashColorHex });
    return dto;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Move to sprint failed');
  }
};

export const postTaskMarkDone = async (taskId: string, { flashColorHex }: any = {}) => {
  try {
    const res = await apiInstance.post(`/tasks/${taskId}/mark-done`);
    const dto = res?.data?.data ?? res?.data;
    flashTaskCard(taskId, { colorHex: flashColorHex });
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
    const dto = res?.data?.data ?? res?.data; // { partA, partB }
    // Flash cho cả A (update) và B (new)
    if (dto?.partA?.id) flashTaskCard(dto.partA.id, { colorHex: flashColorHexA });
    if (dto?.partB?.id) flashTaskCard(dto.partB.id, { colorHex: flashColorHexB ?? flashColorHexA });
    return dto;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Split failed');
  }
};
