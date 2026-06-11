import { User } from '@/entities';
import { IUserDAO } from '@/interfaces';
import { client } from './client';
import { User as UserModel } from '@/models';

export default class UserDAO implements IUserDAO {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);
    return createdUser.toObject() as unknown as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? (user.toObject() as unknown as User) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? (user.toObject() as unknown as User) : null;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const UserModel = client.model('User');
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true });
    return updatedUser ? (updatedUser.toObject() as unknown as User) : ({} as User);
  }

  async delete(id: number): Promise<void> {
    const UserModel = client.model('User');
    await UserModel.findByIdAndDelete(id);
  }
}
