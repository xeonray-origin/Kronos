import { taskSlice } from '@/store/slice/task.slice';
import { TaskStatus, type ITasksState } from '@/types';

const reducer = taskSlice.reducer;
const { setTasks, addTask, setStatus } = taskSlice.actions;

const MOCK_TASK = { _id: '1', title: 'Task', userId: 'u1', status: TaskStatus.TODO };
const MOCK_TASK_2 = { _id: '2', title: 'Second', userId: 'u1', status: TaskStatus.TODO };

const initialState: ITasksState = { items: [], status: 'idle', error: null };

describe('tasks slice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setTasks replaces the items', () => {
    const state = reducer({ ...initialState, items: [MOCK_TASK] }, setTasks([MOCK_TASK_2]));
    expect(state.items).toEqual([MOCK_TASK_2]);
  });

  it('addTask appends a task to the items', () => {
    const state = reducer({ ...initialState, items: [MOCK_TASK] }, addTask(MOCK_TASK_2));
    expect(state.items).toEqual([MOCK_TASK, MOCK_TASK_2]);
  });

  it('setStatus updates the status', () => {
    const state = reducer(initialState, setStatus('loading'));
    expect(state.status).toBe('loading');
  });
});
