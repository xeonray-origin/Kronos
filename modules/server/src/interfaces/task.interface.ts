import { Task } from '@/entities';
import { Types } from 'mongoose';

export interface ITaskTimeInput {
  durationSeconds: number;
}

export interface ITaskDAO {
  create: (task: Task) => Promise<Task>;
  update: (
    id: Types.ObjectId | string,
    userId: string,
    task: Partial<Task>,
  ) => Promise<Task | null>;
  delete: (id: Types.ObjectId | string, userId: string) => Promise<boolean>;
  findByUserId: (userId: string) => Promise<Task[]>;
  logTime: (
    id: Types.ObjectId | string,
    userId: string,
    durationSeconds: number,
  ) => Promise<Task | null>;
}
