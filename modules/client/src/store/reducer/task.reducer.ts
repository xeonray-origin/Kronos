import { ITask } from '@/types';
import { PayloadAction } from '@reduxjs/toolkit';
import { ApiStatus, ITasksState } from '../slice';

export default {
  setTasks(state: ITasksState, action: PayloadAction<ITask[]>) {
    return { ...state, items: action.payload };
  },
  addTask(state: ITasksState, action: PayloadAction<ITask>) {
    return { ...state, items: [...state.items, action.payload] };
  },
  setStatus(state: ITasksState, action: PayloadAction<ApiStatus>) {
    return { ...state, status: action.payload };
  },
};
