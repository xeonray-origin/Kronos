import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { taskApi } from '@/api';
import type { ITask } from '@/types';

export interface TasksState {
  items: ITask[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk<ITask[], void, { rejectValue: string }>(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await taskApi.getTasks();
    } catch (e) {
      const err = e as { response?: { data?: { error?: string } } };
      return rejectWithValue(err.response?.data?.error ?? 'Failed to fetch tasks');
    }
  },
);

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch tasks';
      });
  },
});

export const taskActions = tasksSlice.actions;

export default tasksSlice.reducer;
