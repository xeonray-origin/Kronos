import { taskSlice } from '@/store/slice/task.slice';
import { TaskStatus, type ITasksState } from '@/types';

const reducer = taskSlice.reducer;
const { setTasks, addTask, updateTask, setStatus, setActiveLabel } = taskSlice.actions;

const MOCK_TASK = { id: '1', title: 'Task', userId: 'u1', status: TaskStatus.BACKLOG };
const MOCK_TASK_2 = { id: '2', title: 'Second', userId: 'u1', status: TaskStatus.BACKLOG };

const initialState: ITasksState = { items: [], status: 'idle', error: null, activeLabel: null };

describe('tasks slice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setTasks replaces the items and clears the active label', () => {
    const state = reducer(
      { ...initialState, items: [MOCK_TASK], activeLabel: 'frontend' },
      setTasks([MOCK_TASK_2]),
    );
    expect(state.items).toEqual([MOCK_TASK_2]);
    expect(state.activeLabel).toBeNull();
  });

  it('addTask appends a task to the items', () => {
    const state = reducer({ ...initialState, items: [MOCK_TASK] }, addTask(MOCK_TASK_2));
    expect(state.items).toEqual([MOCK_TASK, MOCK_TASK_2]);
  });

  it('updateTask replaces the matching item and leaves the others untouched', () => {
    const updated = { ...MOCK_TASK_2, status: TaskStatus.DONE };
    const state = reducer(
      { ...initialState, items: [MOCK_TASK, MOCK_TASK_2] },
      updateTask(updated),
    );
    expect(state.items).toEqual([MOCK_TASK, updated]);
  });

  it('setStatus updates the status', () => {
    const state = reducer(initialState, setStatus('loading'));
    expect(state.status).toBe('loading');
  });

  it('setActiveLabel sets and clears the active label', () => {
    const selected = reducer(initialState, setActiveLabel('frontend'));
    expect(selected.activeLabel).toBe('frontend');
    expect(reducer(selected, setActiveLabel(null)).activeLabel).toBeNull();
  });
});
