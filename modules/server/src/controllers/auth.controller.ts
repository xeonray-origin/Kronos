import { AuthUser, User } from '@/entities';
import { IAction, IRequest, IValidator, SessionInfo } from '@/interfaces';
import { Response } from 'express';
import _ from 'lodash';
export default class AuthController {
  constructor(
    protected registerUser: IAction<User>,
    protected loginUser: IAction<
      Pick<AuthUser, 'email' | 'password'>,
      { success: boolean; token: string; refreshToken: string }
    >,
    protected refreshToken: IAction<
      SessionInfo,
      { success: boolean; token: string; refreshToken: string }
    >,
  ) {}

  async register(request: IRequest): Promise<User> {
    const { body: payload } = request;
    return await this.registerUser.call(payload);
  }

  async login(
    request: IRequest,
    response: Response,
  ): Promise<{
    success: boolean;
    token: string;
  }> {
    const { body: payload } = request;
    const result = await this.loginUser.call(payload);
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    const responsePayload = _.omit(result, ['refreshToken']);
    return _.update(responsePayload, 'token', (token: string) => `Bearer-${token}`);
  }

  async refresh(
    request: IRequest,
    response: Response,
  ): Promise<{
    success: boolean;
    token: string;
  }> {
    const { body: payload } = request;
    const result = await this.refreshToken.call(payload);
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    const responsePayload = _.omit(result, ['refreshToken']);
    return _.update(responsePayload, 'token', (token: string) => `Bearer-${token}`);
  }
}
