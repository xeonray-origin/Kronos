import { Types } from 'mongoose';
import Entity from './entity';

export class Task extends Entity<Task> {
  _id?: Types.ObjectId;
  title!: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
  userId!: Types.ObjectId;
  status!: 'BACKLOG' | 'DONE';
  timeSpentSeconds?: number;
}
