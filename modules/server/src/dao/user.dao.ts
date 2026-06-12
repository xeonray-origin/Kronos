import { AuthUser, User } from '@/entities';
import { IUserDAO } from '@/interfaces';
import { client } from './client';
import { User as UserModel, AuthUser as AuthUserModel } from '@/models';

export default class UserDAO implements IUserDAO {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);
    return createdUser as unknown as User;
  }

  async storePasswordHash(authUser: AuthUser): Promise<AuthUser> {
    const created = new AuthUserModel(authUser);
    const createAuthUser = await created.save();
    return createAuthUser.toObject() as unknown as AuthUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? (user.toObject() as unknown as User) : null;
  }

  async findAuthByEmail(email: string): Promise<AuthUser | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    const auth = await AuthUserModel.findById(user._id);
    if (!auth) return null;
    return { ...user.toObject(), ...auth.toObject() } as unknown as AuthUser;
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
