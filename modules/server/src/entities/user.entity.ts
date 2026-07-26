import { Types } from 'mongoose';
import Entity from './entity';
import type { IName } from '@/interfaces';

export class User extends Entity<User> {
  _id!: Types.ObjectId;
  name!: IName;
  email!: string;
  phoneNumber!: string;
  role!: string;
  labelRef!: Types.ObjectId;
}
