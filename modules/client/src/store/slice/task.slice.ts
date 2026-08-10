import { createSlice } from '@reduxjs/toolkit';
import type { ITasksState } from '@/types';
import { taskReducer } from '../reducer';

const initialState: ITasksState = {
  items: [],
  status: 'idle',
  error: null,
  activeLabel: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: taskReducer,
});

export default taskSlice;
