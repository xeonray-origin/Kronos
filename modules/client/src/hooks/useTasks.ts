import { useRef, useState } from 'react';
import { taskApi } from '@/api';
import { taskActions, useAppDispatch, useAppSelector } from '@/store';
import { TaskStatus } from '@/types';
import type { CreateTaskInput, ITask } from '@/types';

export const DELETE_UNDO_MS = 5000;

interface PendingDelete {
  task: ITask;
  index: number;
  timer: ReturnType<typeof setTimeout>;
}

export function useTasks() {
  const dispatch = useAppDispatch();
  const { items, status, error, activeLabel } = useAppSelector((state) => state.tasks);

  const pendingRef = useRef(new Map<string, PendingDelete>());
  const [pendingDeletes, setPendingDeletes] = useState<{ id: string; title: string }[]>([]);

  const fetchTasks = async () => {
    try {
      dispatch(taskActions.setStatus('loading'));
      const response = await taskApi.getTasks();
      if (response) dispatch(taskActions.setTasks(response));
      dispatch(taskActions.setStatus('idle'));
    } catch (e) {
      console.log(e);
      dispatch(taskActions.setTasks([]));
      dispatch(taskActions.setStatus('error'));
    }
  };

  const createTask = async (input: CreateTaskInput) => {
    try {
      const created = await taskApi.createTask(input);
      dispatch(taskActions.addTask(created));
      return created;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const current = items.find((task) => task.id === id);
    if (!current) return;

    const status = current.status === TaskStatus.DONE ? TaskStatus.BACKLOG : TaskStatus.DONE;
    dispatch(taskActions.updateTask({ ...current, status }));

    try {
      const updated = await taskApi.updateTask(id, { status });
      dispatch(taskActions.updateTask(updated));
    } catch (e) {
      console.log(e);
      dispatch(taskActions.updateTask(current));
    }
  };

  const settleDelete = (id: string) => {
    pendingRef.current.delete(id);
    setPendingDeletes((current) => current.filter((pending) => pending.id !== id));
  };

  const deleteTask = (id: string) => {
    const index = items.findIndex((task) => task.id === id);
    const task = items[index];
    if (!task || pendingRef.current.has(id)) return;

    dispatch(taskActions.removeTask(id));
    setPendingDeletes((current) => [...current, { id, title: task.title }]);

    const timer = setTimeout(async () => {
      settleDelete(id);
      try {
        await taskApi.deleteTask(id);
      } catch (e) {
        console.log(e);
        dispatch(taskActions.restoreTask({ task, index }));
      }
    }, DELETE_UNDO_MS);
    pendingRef.current.set(id, { task, index, timer });
  };

  const undoDelete = (id: string) => {
    const pending = pendingRef.current.get(id);
    if (!pending) return;
    clearTimeout(pending.timer);
    settleDelete(id);
    dispatch(taskActions.restoreTask({ task: pending.task, index: pending.index }));
  };

  const selectLabel = (label: string) => {
    dispatch(taskActions.setActiveLabel(activeLabel === label ? null : label));
  };

  return {
    tasks: items,
    apiStatus: status,
    error,
    activeLabel,
    fetchTasks,
    createTask,
    toggleTaskStatus,
    deleteTask,
    undoDelete,
    pendingDeletes,
    selectLabel,
  };
}
