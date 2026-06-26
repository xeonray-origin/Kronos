import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks } from '@/store/tasks.slice';

export function useTasks() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.tasks);
  return {
    tasks: items,
    isLoading: status === 'loading',
    error,
    fetchTasks: () => dispatch(fetchTasks()),
  };
}
