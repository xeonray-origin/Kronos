import client from './client';
import type { ITask } from '@/types';

export const getTasks = () => client.get<ITask[]>('/task').then((response) => response.data);
