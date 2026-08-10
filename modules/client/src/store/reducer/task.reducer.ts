import type { ApiStatus, ITask, ITasksState } from '@/types';
import { PayloadAction } from '@reduxjs/toolkit';

export default {
  setTasks(state: ITasksState, action: PayloadAction<ITask[]>) {
    return { ...state, items: action.payload, activeLabel: null };
  },
  addTask(state: ITasksState, action: PayloadAction<ITask>) {
    return { ...state, items: [...state.items, action.payload] };
  },
  updateTask(state: ITasksState, action: PayloadAction<ITask>) {
    return {
      ...state,
      items: state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
    };
  },
  setStatus(state: ITasksState, action: PayloadAction<ApiStatus>) {
    return { ...state, status: action.payload };
  },
  setActiveLabel(state: ITasksState, action: PayloadAction<string | null>) {
    return { ...state, activeLabel: action.payload };
  },
};
