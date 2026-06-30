import { taskApi } from '@/api';
import { taskActions, useAppDispatch, useAppSelector } from '@/store';

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
    }
  };

  return {
    tasks: items,
    error,
    fetchTasks,
  };
}
