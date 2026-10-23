const mockRouter = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
};

const mockLimiter = jest.fn();

jest.mock('express', () => ({
  __esModule: true,
  default: { Router: jest.fn(() => mockRouter) },
}));

jest.mock('@/config', () => ({ services: { auth: { DAO: jest.fn(), validator: {} } } }));
jest.mock('@/dao/session.dao', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@/controllers/auth.controller', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@/actions', () => ({
  RegisterUser: jest.fn(),
  LoginUser: jest.fn(),
  RefreshToken: jest.fn(),
  LogoutUser: jest.fn(),
}));
jest.mock('@/utils', () => ({
  Hash: jest.fn(() => ({ hashPassword: jest.fn(), verifyPassword: jest.fn() })),
  JWTToken: jest.fn(),
  userValidator: {},
  loginValidator: {},
}));
jest.mock('@/middlewares/rate-limit.middleware', () => ({ authRateLimiter: mockLimiter }));

import '@/routes/auth.route';

describe('auth route', () => {
  it.each(['/register', '/login'])('rate limits POST %s', (path) => {
    const call = mockRouter.post.mock.calls.find(([route]) => route === path);

    expect(call?.[1]).toBe(mockLimiter);
  });

  it('does not rate limit GET /refresh', () => {
    const call = mockRouter.get.mock.calls.find(([route]) => route === '/refresh');

    expect(call).toHaveLength(2);
  });

  it('registers /logout as POST without a rate limiter', () => {
    const call = mockRouter.post.mock.calls.find(([route]) => route === '/logout');

    expect(call).toHaveLength(2);
  });

  it('does not register /logout as GET', () => {
    const call = mockRouter.get.mock.calls.find(([route]) => route === '/logout');

    expect(call).toBeUndefined();
  });
});
