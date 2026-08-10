import { Task } from '@/entities';
import { Types } from 'mongoose';

export interface ITaskDAO {
  create: (task: Task) => Promise<Task>;
  update: (
    id: Types.ObjectId | string,
    userId: string,
    task: Partial<Task>,
  ) => Promise<Task | null>;
  delete: (id: Types.ObjectId | string, userId: string) => Promise<boolean>;
  findByUserId: (userId: string) => Promise<Task[]>;
}
