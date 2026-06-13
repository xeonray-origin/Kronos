import { Types } from 'mongoose';
import Entity from './entity';

export class Task extends Entity<Task> {
  _id?: Types.ObjectId;
  title!: string;
  description?: string;
  dueDate?: string;
  label?: string;
  priority?: string;
  project?: string;
  userId!: Types.ObjectId;
}
