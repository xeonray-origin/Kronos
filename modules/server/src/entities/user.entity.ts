import Entity from './entity';
import type { IName } from '@/interfaces';

export default class User extends Entity<User> {
  id!: number;
  name!: IName;
  email!: string;
  phoneNumber!: string;
  role!: string;
}
