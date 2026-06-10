import { AuthUser, User } from '@/entities';
import { IAction, IRequest, IValidator } from '@/interfaces';

export default class AuthController {
  constructor(protected registerUser: IAction<User>) {}
  async register(request: IRequest): Promise<User> {
    const { body: payload } = request;
    return await this.registerUser.call(payload);
  }
}
