import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { taskSlice } from '@/store/slice/task.slice';
import { authSlice } from '@/store/slice/auth.slice';
import { TaskStatus, type ITasksState } from '@/types';
import { useTasks } from '@/hooks/useTasks';

jest.mock('@/api/task.api');
import { createTask, getTasks } from '@/api/task.api';

const MOCK_TASK = { _id: '1', title: 'Task', userId: 'u1', status: TaskStatus.TODO };
const CREATED_TASK = { id: '2', title: 'New task', userId: 'u1', status: TaskStatus.BACKLOG };

function makeWrapper(tasksState?: Partial<ITasksState>) {
  const store = configureStore({
    reducer: combineReducers({ tasks: taskSlice.reducer, auth: authSlice.reducer }),
    preloadedState: tasksState
      ? { tasks: { items: [], status: 'idle', error: null, ...tasksState } }
      : undefined,
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children });
}

describe('useTasks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns tasks from the store', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ items: [MOCK_TASK] }),
    });
    expect(result.current.tasks).toEqual([MOCK_TASK]);
  });

  it('returns the error from the store', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ error: 'Something went wrong' }),
    });
    expect(result.current.error).toBe('Something went wrong');
  });

  it('fetches tasks and stores them when the API returns data', async () => {
    (getTasks as jest.Mock).mockResolvedValue([MOCK_TASK]);
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper() });
    await act(async () => {
      await result.current.fetchTasks();
    });
    expect(getTasks).toHaveBeenCalled();
    expect(result.current.tasks).toEqual([MOCK_TASK]);
  });

  it('does not store tasks when the API returns no data', async () => {
    (getTasks as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper() });
    await act(async () => {
      await result.current.fetchTasks();
    });
    expect(getTasks).toHaveBeenCalled();
    expect(result.current.tasks).toEqual([]);
  });

  it('clears tasks when fetching fails', async () => {
    (getTasks as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ items: [MOCK_TASK] }),
    });

    await act(async () => {
      await result.current.fetchTasks();
    });

    expect(result.current.tasks).toEqual([]);
  });

  it('creates a task and appends it to the store', async () => {
    (createTask as jest.Mock).mockResolvedValue(CREATED_TASK);
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ items: [MOCK_TASK] }),
    });

    await act(async () => {
      await result.current.createTask({ title: 'New task' });
    });

    expect(createTask).toHaveBeenCalledWith({ title: 'New task' });
    expect(result.current.tasks).toEqual([MOCK_TASK, CREATED_TASK]);
  });

  it('rethrows and leaves the store untouched when creating fails', async () => {
    (createTask as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ items: [MOCK_TASK] }),
    });

    await act(async () => {
      await expect(result.current.createTask({ title: 'New task' })).rejects.toThrow(
        'Network error',
      );
    });

    expect(result.current.tasks).toEqual([MOCK_TASK]);
  });
});
