import client from './client';
import type { ServerTask } from '@/types';

export const getTasks = () => client.get<ServerTask[]>('/tasks').then((response) => response.data);
