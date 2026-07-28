import client from './client';
import type { CreateTaskInput, ITask, ITaskResponse } from '@/types';

const toTask = ({ _id, ...task }: ITaskResponse): ITask => ({ ...task, id: _id });

export const getTasks = () =>
  client.get<ITaskResponse[]>('/task').then((response) => response.data.map(toTask));

export const createTask = (input: CreateTaskInput) =>
  client.post<ITaskResponse>('/task/create', input).then((response) => toTask(response.data));
