import type { TaskVm } from '@/interfaces/task';
import { GetTaskBySprintId } from '../services/taskService';

export const fetchOrderAndSortTasks = async (
  sprintId: string,
  tasks: TaskVm[],
): Promise<TaskVm[]> => {
  try {
    let allTasks: TaskVm[] = [];
    let page = 1;
    const pageSize = 50;
    let totalCount = 0;

    do {
      const resp = await GetTaskBySprintId(sprintId, '', '', '', '', '', page, pageSize);
      allTasks = allTasks.concat(resp.data.items);
      totalCount = resp.data.totalCount;
      page++;
    } while (allTasks.length < totalCount);

    const orderMap = new Map<string, number>();
    allTasks.forEach((t) => t.id && orderMap.set(t.id, t.orderInSprint ?? 0));

    const updatedTasks = tasks.map((t) => ({
      ...t,
      orderInSprint: t.id ? (orderMap.get(t.id) ?? t.orderInSprint ?? 0) : (t.orderInSprint ?? 0),
    }));

    return updatedTasks.sort((a, b) => (a.orderInSprint ?? 0) - (b.orderInSprint ?? 0));
  } catch (error) {
    console.error('Error in fetchOrderAndSortTasks:', error);
    return tasks.sort((a, b) => (a.orderInSprint ?? 0) - (b.orderInSprint ?? 0));
  }
};
