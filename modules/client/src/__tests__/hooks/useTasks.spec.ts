import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import tasksReducer, { TasksState } from '@/store/tasks.slice';
import authReducer from '@/store/auth.slice';
import { useTasks } from '@/hooks/useTasks';

jest.mock('@/api/task.api');
import { getTasks } from '@/api/task.api';

const MOCK_TASK = { _id: '1', title: 'Task', userId: 'u1' };

function makeWrapper(tasksState?: Partial<TasksState>) {
  const store = configureStore({
    reducer: combineReducers({ tasks: tasksReducer, auth: authReducer }),
    preloadedState: tasksState
      ? { tasks: { items: [], status: 'idle', error: null, ...tasksState } }
      : undefined,
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children });
}

describe('useTasks', () => {
  it('returns tasks from the store', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ items: [MOCK_TASK] }),
    });
    expect(result.current.tasks).toEqual([MOCK_TASK]);
  });

  it('returns isLoading true when status is loading', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ status: 'loading' }),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isLoading false when status is idle', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ status: 'idle' }),
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('returns the error from the store', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: makeWrapper({ status: 'failed', error: 'Something went wrong' }),
    });
    expect(result.current.error).toBe('Something went wrong');
  });

  it('dispatches fetchTasks and calls the API when fetchTasks is invoked', async () => {
    (getTasks as jest.Mock).mockResolvedValue([MOCK_TASK]);
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper() });
    await act(async () => {
      result.current.fetchTasks();
    });
    expect(getTasks).toHaveBeenCalled();
  });
});
