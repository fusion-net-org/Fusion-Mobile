import { apiInstance } from './../api/apiInstance';

export async function fetchSprintBoard(projectId: string) {
  const { data } = await apiInstance.get(`/projects/${projectId}/sprint-board`);
  const payload = data?.data ?? data ?? {};
  const sprints = Array.isArray(payload.sprints)
    ? payload.sprints
    : payload.sprint
      ? [payload.sprint]
      : [];
  return {
    workflow: payload.workflow ?? null,
    sprints,
    tasks: Array.isArray(payload.tasks) ? payload.tasks : [],
  };
}

export async function moveTaskOnBoard(
  projectId: string,
  _sprintId: string,
  taskId: string,
  body: any,
) {
  const payload = {
    toStatusId: body?.toStatusId ?? null,
    toSprintId: body?.toSprintId ?? null,
    newOrder: typeof body?.toIndex === 'number' ? body.toIndex : body?.newOrder,
    actorUserId: body?.actorUserId, // FE nên truyền Guid user hiện tại
  };
  const { data } = await apiInstance.post(
    `/projects/${projectId}/sprint-board/tasks/${taskId}/move`,
    payload,
  );
  return data?.data ?? data ?? true;
}

export async function reorderColumnOnBoard(
  projectId: string,
  sprintId: string,
  statusId: string,
  taskIds: string,
) {
  const items = (Array.isArray(taskIds) ? taskIds : []).map((id, idx) => ({
    taskId: id,
    order: idx,
  }));
  const { data } = await apiInstance.post(`/projects/${projectId}/sprint-board/reorder`, {
    sprintId,
    statusId,
    items,
  });
  return data?.data ?? data ?? true;
}
