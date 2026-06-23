import { Types } from 'mongoose';
import Entity from './entity';

export class Project extends Entity<Project> {
  _id?: Types.ObjectId;
  name!: string;
  emoji?: string;
  shared!: boolean;
  count!: number;
  userId!: Types.ObjectId;
}
