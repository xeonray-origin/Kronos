import { Types } from 'mongoose';
import Entity from './entity';
import type { IName } from '@/interfaces';

export default class User extends Entity<User> {
  _id!: Types.ObjectId;
  name!: IName;
  email!: string;
  phoneNumber!: string;
  role!: string;
}
