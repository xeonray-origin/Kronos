import { Label } from '@/entities';
import { Types } from 'mongoose';

export interface ILabelDAO {
  create: (label: Label) => Promise<Label>;
  update: (id: Types.ObjectId | string, label: Partial<Label>) => Promise<Label>;
  delete: (id: Types.ObjectId | string) => Promise<boolean>;
}
