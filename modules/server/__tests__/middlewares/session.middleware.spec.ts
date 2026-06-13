import SessionMiddleware from '@/middlewares/session.middleware';
import { IJwtToken, JwtTokenPayload } from '@/interfaces';
import { ValidationError } from '@/errors';
import { Request, Response, NextFunction } from 'express';

const makeRequest = (authorization?: string): Request =>
  ({ headers: { authorization } }) as unknown as Request;

const makeResponse = (): Response => {
  const locals: Record<string, unknown> = {};
  return { locals } as unknown as Response;
};

describe('SessionMiddleware', () => {
  let middleware: SessionMiddleware;
  let mockJwtToken: jest.Mocked<IJwtToken>;
  let next: jest.MockedFunction<NextFunction>;

  const validPayload: JwtTokenPayload = {
    exp: 9999999999,
    userId: 'user-123',
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(() => {
    mockJwtToken = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      base64UrlEncode: jest.fn(),
      base64UrlDecode: jest.fn(),
    };
    next = jest.fn();
    middleware = new SessionMiddleware(mockJwtToken);
  });

  it('calls next with 401 ValidationError when Authorization header is missing', async () => {
    await middleware.handle(makeRequest(), makeResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = (next as jest.Mock).mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.httpStatusCode).toBe(401);
    expect(mockJwtToken.verifyToken).not.toHaveBeenCalled();
  });

  it('calls next with 401 ValidationError when Authorization header lacks Bearer prefix', async () => {
    await middleware.handle(makeRequest('Basic sometoken'), makeResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = (next as jest.Mock).mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.httpStatusCode).toBe(401);
    expect(mockJwtToken.verifyToken).not.toHaveBeenCalled();
  });

  it('calls next with 401 ValidationError when token is invalid or expired', async () => {
    mockJwtToken.verifyToken.mockResolvedValue(null);

    await middleware.handle(makeRequest('Bearer bad.token'), makeResponse(), next);

    expect(mockJwtToken.verifyToken).toHaveBeenCalledWith('bad.token');
    const err = (next as jest.Mock).mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.httpStatusCode).toBe(401);
  });

  it('attaches decoded payload to res.locals and calls next without error on valid token', async () => {
    mockJwtToken.verifyToken.mockResolvedValue(validPayload);
    const response = makeResponse();

    await middleware.handle(makeRequest('Bearer valid.jwt.token'), response, next);

    expect(mockJwtToken.verifyToken).toHaveBeenCalledWith('valid.jwt.token');
    expect(response.locals.user).toEqual(validPayload);
    expect(next).toHaveBeenCalledWith();
  });
});
