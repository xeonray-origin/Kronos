import AuthController from '@/controllers/auth.controller';
import { IAction, IRequest, SessionInfo } from '@/interfaces';
import { User, AuthUser } from '@/entities';
import { Response } from 'express';

type ILoginOutput = {
  success: boolean;
  token: string;
  refreshToken: string;
  maxCookieAge?: number;
};

const makeResponse = (): jest.Mocked<Pick<Response, 'cookie'>> => ({
  cookie: jest.fn(),
});

describe('AuthController', () => {
  let controller: AuthController;
  let mockRegisterUser: jest.Mocked<IAction<User>>;
  let mockLoginUser: jest.Mocked<IAction<Pick<AuthUser, 'email' | 'password'>, ILoginOutput>>;
  let mockRefreshToken: jest.Mocked<IAction<SessionInfo, ILoginOutput>>;
  let mockLogoutUser: jest.Mocked<IAction<Pick<AuthUser, '_id'>, { success: boolean }>>;

  beforeEach(() => {
    mockRegisterUser = { call: jest.fn() };
    mockLoginUser = { call: jest.fn() };
    mockRefreshToken = { call: jest.fn() };
    mockLogoutUser = { call: jest.fn() };
    controller = new AuthController(
      mockRegisterUser,
      mockLoginUser,
      mockRefreshToken,
      mockLogoutUser,
    );
  });

  describe('register', () => {
    it('delegates to registerUser action and returns the result', async () => {
      const body = { name: 'Test User', email: 'test@example.com' };
      const created = { ...body } as unknown as User;
      mockRegisterUser.call.mockResolvedValue(created);

      const result = await controller.register({ body });

      expect(mockRegisterUser.call).toHaveBeenCalledWith(body);
      expect(result).toBe(created);
    });
  });

  describe('login', () => {
    const body = { email: 'test@example.com', password: 'secret' };
    const loginOutput: ILoginOutput = {
      success: true,
      token: 'access.token',
      refreshToken: 'refresh.token',
    };

    it('sets an httpOnly cookie with the refresh token', async () => {
      const response = makeResponse() as unknown as Response;
      mockLoginUser.call.mockResolvedValue(loginOutput);

      await controller.login({ body }, response);

      expect(response.cookie).toHaveBeenCalledWith('refreshToken', 'refresh.token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    });

    it('returns the access token with Bearer prefix and omits refreshToken', async () => {
      const response = makeResponse() as unknown as Response;
      mockLoginUser.call.mockResolvedValue(loginOutput);

      const result = await controller.login({ body }, response);

      expect(result).toEqual({ success: true, token: 'Bearer-access.token' });
      expect(result).not.toHaveProperty('refreshToken');
    });
  });

  describe('refresh', () => {
    const body = { refreshToken: 'old.refresh.token' };
    const refreshOutput: ILoginOutput = {
      success: true,
      token: 'new.access.token',
      refreshToken: 'new.refresh.token',
      maxCookieAge: 9999999,
    };

    it('sets an httpOnly cookie with the new refresh token', async () => {
      const response = makeResponse() as unknown as Response;
      mockRefreshToken.call.mockResolvedValue(refreshOutput);

      await controller.refresh({ body }, response);

      expect(response.cookie).toHaveBeenCalledWith('refreshToken', 'new.refresh.token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: refreshOutput.maxCookieAge,
      });
    });

    it('returns the new access token with Bearer prefix and omits refreshToken', async () => {
      const response = makeResponse() as unknown as Response;
      mockRefreshToken.call.mockResolvedValue(refreshOutput);

      const result = await controller.refresh({ body }, response);

      expect(result).toEqual({
        success: true,
        token: 'Bearer-new.access.token',
        maxCookieAge: refreshOutput.maxCookieAge,
      });
      expect(result).not.toHaveProperty('refreshToken');
    });
  });

  describe('logout', () => {
    const body = { refreshToken: 'some.refresh.token' };

    it('clears the refreshToken cookie', async () => {
      const response = makeResponse() as unknown as Response;
      mockLogoutUser.call.mockResolvedValue({ success: true });

      await controller.logout({ body }, response);

      expect(response.cookie).toHaveBeenCalledWith('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
      });
    });

    it('returns success from the logoutUser action', async () => {
      const response = makeResponse() as unknown as Response;
      mockLogoutUser.call.mockResolvedValue({ success: true });

      const result = await controller.logout({ body }, response);

      expect(mockLogoutUser.call).toHaveBeenCalledWith(body);
      expect(result).toEqual({ success: true });
    });
  });
});
