import { Task } from '@/entities';

export interface ITaskDAO {
  create: (task: Task) => Promise<Task>;
}
