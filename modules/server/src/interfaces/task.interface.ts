import { Task } from '@/entities';
import { Types } from 'mongoose';

export interface ITaskDAO {
  create: (task: Task) => Promise<Task>;
  update: (id: Types.ObjectId | string, task: Partial<Task>) => Promise<Task>;
  delete: (id: Types.ObjectId | string) => Promise<boolean>;
}
