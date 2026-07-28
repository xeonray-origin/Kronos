import { taskApi } from '@/api';
import { taskActions, useAppDispatch, useAppSelector } from '@/store';
import type { CreateTaskInput } from '@/types';

export function useTasks() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.tasks);

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

  return {
    tasks: items,
    status,
    error,
    fetchTasks,
    createTask,
  };
}
