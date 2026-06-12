import { AuthUser, User } from '@/entities';

export type FirstName = string;
export type LastName = string;

export interface IName {
  firstName: FirstName;
  lastName: LastName;
}

export interface IUserDAO {
  create(user: User): Promise<User>;
  storePasswordHash(authUser: Pick<AuthUser, 'password' | 'salt' | '_id'>): Promise<AuthUser>;
  findByEmail(email: string): Promise<User | null>;
  findAuthByEmail(email: string): Promise<AuthUser | null>;
  findById(id: number): Promise<User | null>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}
