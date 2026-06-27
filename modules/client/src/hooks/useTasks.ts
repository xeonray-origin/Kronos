import { useAppDispatch, useAppSelector, fetchTasks } from '@/store';

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
