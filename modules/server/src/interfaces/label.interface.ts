import { Label } from '@/entities';
import { Types } from 'mongoose';

export interface ILabelDAO {
  create: (label: Label) => Promise<Label>;
  update: (
    id: Types.ObjectId | string,
    userId: string,
    label: Partial<Label>,
  ) => Promise<Label | null>;
  delete: (id: Types.ObjectId | string, userId: string) => Promise<boolean>;
}
