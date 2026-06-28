import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ITask } from '@/types';
import { taskReducer } from '../reducer';

export type ApiStatus = 'loading' | 'error' | 'idle';

export interface ITasksState {
  items: ITask[];
  status: ApiStatus;
  error: string | null;
}

const initialState: ITasksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: taskReducer,
});

export default taskSlice;
