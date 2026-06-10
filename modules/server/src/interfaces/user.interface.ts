import { User } from '@/entities';

export type FirstName = string;
export type LastName = string;

export interface IName {
  firstName: FirstName;
  lastName: LastName;
}

export interface IUserDAO {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}
