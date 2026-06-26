import tasksReducer, { fetchTasks, type TasksState } from '@/store/tasks.slice';

jest.mock('@/api/task.api');
import { getTasks } from '@/api/task.api';

const initialState: TasksState = { items: [], status: 'idle', error: null };

const MOCK_TASKS = [{ _id: '1', title: 'Task', userId: 'u1' }];

describe('tasksSlice', () => {
  it('returns the initial state', () => {
    expect(tasksReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets status to loading on pending', () => {
    const state = tasksReducer(
      { ...initialState, error: 'previous error' },
      fetchTasks.pending('', undefined),
    );
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('populates items and clears status on fulfilled', () => {
    const state = tasksReducer(
      { ...initialState, status: 'loading' },
      fetchTasks.fulfilled(MOCK_TASKS, '', undefined),
    );
    expect(state.status).toBe('idle');
    expect(state.items).toEqual(MOCK_TASKS);
  });

  it('sets error on rejected with payload', () => {
    const action = fetchTasks.rejected(null, '', undefined, 'Server error');
    const state = tasksReducer({ ...initialState, status: 'loading' }, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Server error');
  });

  it('sets fallback error on rejected without payload', () => {
    const action = fetchTasks.rejected(null, '', undefined, undefined);
    const state = tasksReducer(initialState, action);
    expect(state.error).toBe('Failed to fetch tasks');
  });

  describe('fetchTasks', () => {
    it('returns tasks from the API on success', async () => {
      (getTasks as jest.Mock).mockResolvedValue(MOCK_TASKS);
      const result = await fetchTasks()(jest.fn(), jest.fn(), undefined);
      expect(result.payload).toEqual(MOCK_TASKS);
    });

    it('rejects with server error message on failure', async () => {
      const axiosError = { response: { data: { error: 'Unauthorized' } } };
      (getTasks as jest.Mock).mockRejectedValue(axiosError);
      const result = await fetchTasks()(jest.fn(), jest.fn(), undefined);
      expect(result.payload).toBe('Unauthorized');
    });

    it('rejects with fallback message when no server error provided', async () => {
      (getTasks as jest.Mock).mockRejectedValue(new Error('Network error'));
      const result = await fetchTasks()(jest.fn(), jest.fn(), undefined);
      expect(result.payload).toBe('Failed to fetch tasks');
    });
  });
});
