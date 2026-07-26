import { Types } from 'mongoose';
import Entity from './entity';

export class Label extends Entity<Label> {
  _id?: Types.ObjectId;
  labels!: string[];
}
