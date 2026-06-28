import client from './client';
import type { ITask } from '@/types';

export const getTasks = () => client.get<ITask[]>('/tasks').then((response) => response.data);
