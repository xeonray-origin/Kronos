import type { ITask } from './task.types';

export type ApiStatus = 'loading' | 'error' | 'idle';

export interface IAuthState {
  isLoggedIn: boolean;
  token: string;
  user: {};
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

export interface ITasksState {
  items: ITask[];
  status: ApiStatus;
  error: string | null;
}
