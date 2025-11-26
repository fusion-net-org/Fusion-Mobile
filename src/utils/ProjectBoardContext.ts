import type { SprintVm } from '@/interfaces/sprint';
import { TaskVm } from '@/interfaces/task';
import {
  patchTaskStatusById,
  postMoveTask,
  postTaskMarkDone,
  postTaskSplit,
  putReorderTask,
} from '@/src/services/taskService';
import React, { useEffect, useRef, useState } from 'react';

export type ProjectBoardContextType = {
  sprints: SprintVm[];
  tasks: TaskVm[];
  loading: boolean;

  changeStatus: (projectId: string, t: TaskVm, nextStatusId: string) => Promise<void>;
  moveToNextSprint: (projectId: string, t: TaskVm, toSprintId?: string) => Promise<void>;
  reorder: (
    projectId: string,
    sprintId: string,
    t: TaskVm,
    toStatusId: string,
    toIndex: number,
  ) => Promise<void>;
  done: (projectId: string, t: TaskVm) => Promise<void>;
  split: (projectId: string, t: TaskVm) => Promise<void>;
  createTask: (
    projectId: string,
    draft: Partial<TaskVm> & { title: string; sprintId: string; workflowStatusId?: string },
  ) => Promise<TaskVm>;

  attachTaskFromApi: (api: any) => void;
  attachTaskVm: (vm: TaskVm) => void;
};

export const ProjectBoardContext = React.createContext<ProjectBoardContextType | null>(null);

export function useProjectBoard() {
  const ctx = React.useContext(ProjectBoardContext);
  if (!ctx) throw new Error('useProjectBoard must be inside Provider');
  return ctx;
}

function ensureColumns(s: SprintVm): SprintVm {
  const cols: Record<string, TaskVm[]> = {};
  for (const id of s.statusOrder ?? []) cols[id] = [];
  return { ...s, columns: Object.keys(cols).length ? cols : (s.columns ?? {}) };
}

function normalizeTaskStatus(t: TaskVm, s: SprintVm): TaskVm {
  let statusId = t.workflowStatusId;

  if (!statusId || !s.statusMeta?.[statusId]) {
    const byCode = Object.values(s.statusMeta ?? {}).find((m) => m.code === t.statusCode);
    statusId = byCode?.id ?? s.statusOrder[0];
  }

  const meta = s.statusMeta[statusId];

  return {
    ...t,
    workflowStatusId: statusId,
    statusCode: meta?.code ?? t.statusCode,
    statusCategory: meta?.category ?? t.statusCategory,
  };
}

function inRange(iso: string, start?: string, end?: string) {
  if (!iso) return false;
  const d = new Date(iso).getTime();
  const s = start ? new Date(start).getTime() : -Infinity;
  const e = end ? new Date(end).getTime() : +Infinity;
  return d >= s && d <= e;
}

function syncColumns(rawSprints: SprintVm[], tasks: TaskVm[]): SprintVm[] {
  const map = new Map<string, SprintVm>();
  for (const s of rawSprints) map.set(s.id, ensureColumns(s));

  const all = [...map.values()];

  for (const t of tasks) {
    let sid = t.sprintId;

    if (!sid) {
      const anchor = t.dueDate || t.openedAt || t.createdAt || '';
      const hit = all.find((s) => inRange(anchor, s.start, s.end));
      sid = hit?.id ?? null;
    }

    if (!sid) continue;
    const s = map.get(sid);
    if (!s) continue;

    const nt = normalizeTaskStatus(t, s);
    if (!Array.isArray(s.columns[nt.workflowStatusId])) s.columns[nt.workflowStatusId] = [];
    s.columns[nt.workflowStatusId].push(nt);
  }

  for (const s of all) {
    for (const colId of Object.keys(s.columns)) {
      s.columns[colId].sort((a, b) => (a.orderInSprint ?? 0) - (b.orderInSprint ?? 0));
    }
  }

  return [...map.values()];
}

function uuid() {
  return crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/* ========================= Provider Logic ========================= */

export function useProjectBoardProviderLogic(
  projectId: string,
  initialData?: { sprints: SprintVm[]; tasks: TaskVm[] },
) {
  const [tasks, setTasks] = useState<TaskVm[]>(initialData?.tasks ?? []);
  const [sprints, setSprints] = useState<SprintVm[]>(() =>
    syncColumns(initialData?.sprints ?? [], initialData?.tasks ?? []),
  );
  const [loading] = useState(false);

  const sRef = useRef(sprints);
  const tRef = useRef(tasks);

  useEffect(() => void (sRef.current = sprints), [sprints]);
  useEffect(() => void (tRef.current = tasks), [tasks]);

  function dedupe(arr: TaskVm[]) {
    const m = new Map(arr.map((x) => [x.id, x]));
    return [...m.values()];
  }

  const applyWithColumns = (fn: (prev: TaskVm[]) => TaskVm[]) => {
    setTasks((prev) => {
      const next = dedupe(fn(prev));
      setSprints((prevS) => syncColumns(prevS, next));
      return next;
    });
  };

  /* ------------------ attachTaskVm ------------------ */
  const attachTaskVm = (vm: TaskVm) => {
    const sp = sRef.current.find((s) => s.id === vm.sprintId);
    const normalized = sp ? normalizeTaskStatus(vm, sp) : vm;

    applyWithColumns((prev) =>
      prev.some((x) => x.id === normalized.id)
        ? prev.map((x) => (x.id === normalized.id ? { ...x, ...normalized } : x))
        : [normalized, ...prev],
    );
  };

  /* ------------------ attachTaskFromApi ------------------ */
  const attachTaskFromApi = (api: any) => {
    const sid = api.sprintId ?? api.sprint_id;
    const sprint = sRef.current.find((s) => s.id === sid);
    if (!sprint) return;

    const rawStatus = api.workflowStatusId ?? api.statusId ?? sprint.statusOrder[0];
    const statusId = sprint.statusMeta?.[rawStatus] ? rawStatus : sprint.statusOrder[0];
    const meta = sprint.statusMeta?.[statusId];

    const vm: TaskVm = {
      id: api.id,
      code: api.code ?? '',
      title: api.title ?? '',
      type: api.type ?? 'Feature',
      priority: api.priority ?? 'Medium',
      storyPoints: api.storyPoints ?? 0,
      estimateHours: api.estimateHours ?? 0,
      remainingHours: api.remainingHours ?? api.estimateHours ?? 0,
      sprintId: sprint.id,
      workflowStatusId: statusId,

      statusCode: meta?.code ?? '',
      statusCategory: meta?.category ?? 'TODO',
      StatusName: meta?.name ?? '',

      dueDate: api.dueDate ?? undefined,
      openedAt: api.openedAt ?? new Date().toISOString(),
      createdAt: api.createdAt ?? new Date().toISOString(),
      updatedAt: api.updatedAt ?? new Date().toISOString(),

      assignees: [],
      dependsOn: [],
      parentTaskId: api.parentTaskId ?? null,
      carryOverCount: api.carryOverCount ?? 0,
      sourceTicketId: null,
      sourceTicketCode: '',
    };

    applyWithColumns((prev) => [...prev, vm]);
  };

  /* ------------------ changeStatus ------------------ */
  const changeStatus = async (_pid: string, t: TaskVm, nextStatusId: string) => {
    const sp = sRef.current.find((s) => s.id === t.sprintId);
    const meta = sp?.statusMeta?.[nextStatusId];

    applyWithColumns((prev) =>
      prev.map((x) =>
        x.id === t.id
          ? {
              ...x,
              workflowStatusId: nextStatusId,
              statusCode: meta?.code ?? x.statusCode,
              statusCategory: meta?.category ?? x.statusCategory,
            }
          : x,
      ),
    );

    try {
      const dto = await patchTaskStatusById(t.id, nextStatusId);
      attachTaskFromApi(dto);
    } catch {}
  };

  /* ------------------ reorder ------------------ */
  const reorder = async (
    pid: string,
    sprintId: string,
    t: TaskVm,
    toStatusId: string,
    toIndex: number,
  ) => {
    const sp = sRef.current.find((s) => s.id === sprintId);
    const meta = sp?.statusMeta?.[toStatusId];

    applyWithColumns((prev) =>
      prev.map((x) =>
        x.id === t.id
          ? {
              ...x,
              workflowStatusId: toStatusId,
              statusCode: meta?.code ?? x.statusCode,
              statusCategory: meta?.category ?? x.statusCategory,
            }
          : x,
      ),
    );

    try {
      const dto = await putReorderTask(pid, sprintId, {
        taskId: t.id,
        toStatusId,
        toIndex,
      });
      attachTaskFromApi(dto);
    } catch {}
  };

  /* ------------------ moveToNextSprint ------------------ */
  const moveToNextSprint = async (pid: string, t: TaskVm, toSprintId?: string) => {
    const all = sRef.current;
    const cur = all.findIndex((s) => s.id === t.sprintId);
    const target = toSprintId ? all.find((s) => s.id === toSprintId) : all[cur + 1];

    applyWithColumns((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, sprintId: target?.id ?? x.sprintId } : x)),
    );

    try {
      const dto = await postMoveTask(t.id, target?.id ?? toSprintId!);
      attachTaskFromApi(dto);
    } catch {}
  };

  /* ------------------ done ------------------ */
  const done = async (_pid: string, t: TaskVm) => {
    const sp = sRef.current.find((s) => s.id === t.sprintId);
    if (!sp) return;

    const finalId =
      sp.statusOrder.find((id) => sp.statusMeta[id]?.isFinal) ?? sp.statusOrder.at(-1);

    applyWithColumns((prev) =>
      prev.map((x) =>
        x.id === t.id
          ? {
              ...x,
              workflowStatusId: finalId!,
              statusCode: sp.statusMeta[finalId!]?.code ?? x.statusCode,
              statusCategory: 'DONE',
            }
          : x,
      ),
    );

    try {
      const dto = await postTaskMarkDone(t.id);
      attachTaskFromApi(dto);
    } catch {}
  };

  /* ------------------ split ------------------ */
  const split = async (_pid: string, t: TaskVm) => {
    try {
      const dto = await postTaskSplit(t.id);
      if (dto?.partA) attachTaskFromApi(dto.partA);
      if (dto?.partB) attachTaskFromApi(dto.partB);
    } catch {}
  };

  /* ------------------ createTask ------------------ */
  const createTask: ProjectBoardContextType['createTask'] = async (_pid, draft) => {
    const sp = sRef.current.find((s) => s.id === draft.sprintId);
    const statusId =
      draft.workflowStatusId && sp?.statusMeta[draft.workflowStatusId]
        ? draft.workflowStatusId
        : sp?.statusOrder?.[0];

    const now = new Date().toISOString();

    const newTask: TaskVm = {
      id: uuid(),
      code: `PRJ-T-${Math.floor(100 + Math.random() * 900)}`,
      title: draft.title.trim(),
      sprintId: draft.sprintId,
      workflowStatusId: statusId ?? 'st-todo',
      statusCode: sp?.statusMeta[statusId!]?.code ?? 'todo',
      statusCategory: sp?.statusMeta[statusId!]?.category ?? 'TODO',
      StatusName: sp?.statusMeta[statusId!]?.name ?? '',

      type: draft.type ?? 'Feature',
      priority: draft.priority ?? 'Medium',
      storyPoints: draft.storyPoints ?? 0,
      estimateHours: draft.estimateHours ?? 0,
      remainingHours: draft.remainingHours ?? 0,

      openedAt: now,
      createdAt: now,
      updatedAt: now,

      assignees: draft.assignees ?? [],
      dependsOn: [],
      parentTaskId: null,
      carryOverCount: 0,
      dueDate: draft.dueDate,

      sourceTicketId: null,
      sourceTicketCode: null,
    };

    applyWithColumns((prev) => [...prev, newTask]);
    return newTask;
  };

  return {
    sprints,
    tasks,
    loading,

    changeStatus,
    moveToNextSprint,
    reorder,
    done,
    split,
    createTask,

    attachTaskFromApi,
    attachTaskVm,
  } satisfies ProjectBoardContextType;
}
