import { AuthUser, User } from '@/entities';
import { IAction, IRequest, IValidator } from '@/interfaces';

export default class AuthController {
  constructor(
    protected registerUser: IAction<User>,
    protected loginUser: IAction<
      Pick<AuthUser, 'email' | 'password'>,
      { success: boolean; token: string }
    >,
  ) {}

  async register(request: IRequest): Promise<User> {
    const { body: payload } = request;
    return await this.registerUser.call(payload);
  }

  async login(request: IRequest): Promise<{ success: boolean; token: string }> {
    const { body: payload } = request;
    return await this.loginUser.call(payload);
  }
}
