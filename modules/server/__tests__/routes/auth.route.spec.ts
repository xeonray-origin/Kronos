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

  it.each(['/refresh', '/logout'])('does not rate limit GET %s', (path) => {
    const call = mockRouter.get.mock.calls.find(([route]) => route === path);

    expect(call).toHaveLength(2);
  });
});
