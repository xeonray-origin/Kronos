import RefreshToken from '@/actions/user/refresh';
import { AuthUser, SessionPayload } from '@/entities';
import { IJwtToken, ISessionDAO, IUserDAO } from '@/interfaces';
import { Types } from 'mongoose';

const makeUser = (fields: Partial<AuthUser> = {}): AuthUser =>
  Object.assign(Object.create(AuthUser.prototype), fields);

const makeSessionPayload = (fields: Partial<SessionPayload> = {}): SessionPayload =>
  Object.assign(Object.create(SessionPayload.prototype), fields);

describe('RefreshToken', () => {
  let refreshToken: RefreshToken;
  let mockSessionDAO: jest.Mocked<ISessionDAO>;
  let mockUserDAO: jest.Mocked<IUserDAO>;
  let mockJwtToken: jest.Mocked<IJwtToken>;

  const userId = new Types.ObjectId();
  const payload = makeSessionPayload({ refreshToken: 'old.refresh.token' });
  const decodedPayload = {
    exp: 9999999999,
    userId: userId.toString(),
    email: 'user@example.com',
    role: 'user',
  };
  const storedUser = makeUser({ _id: userId, email: 'user@example.com', role: 'user' });

  beforeEach(() => {
    mockSessionDAO = { storeRefreshToken: jest.fn(), invalidatePreviousToken: jest.fn() };
    mockUserDAO = {
      create: jest.fn(),
      storePasswordHash: jest.fn(),
      findByEmail: jest.fn(),
      findAuthByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockJwtToken = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      base64UrlEncode: jest.fn(),
      base64UrlDecode: jest.fn(),
    };
    refreshToken = new RefreshToken(mockSessionDAO, mockUserDAO, mockJwtToken);
  });

  it('throws ValidationError when refresh token is invalid', async () => {
    mockJwtToken.verifyRefreshToken.mockResolvedValue(null);
    await expect(refreshToken.call(payload)).rejects.toThrow('Unauthorized!');
    expect(mockUserDAO.findAuthByEmail).not.toHaveBeenCalled();
  });

  it('throws ValidationError when user is not found', async () => {
    mockJwtToken.verifyRefreshToken.mockResolvedValue(decodedPayload);
    mockUserDAO.findAuthByEmail.mockResolvedValue(null);
    await expect(refreshToken.call(payload)).rejects.toThrow('Unauthorized!');
    expect(mockJwtToken.generateToken).not.toHaveBeenCalled();
  });

  it('rotates tokens and returns new access and refresh tokens', async () => {
    mockJwtToken.verifyRefreshToken.mockResolvedValue(decodedPayload);
    mockUserDAO.findAuthByEmail.mockResolvedValue(storedUser);
    mockJwtToken.generateToken.mockResolvedValue('new.access.token');
    mockJwtToken.generateRefreshToken.mockResolvedValue('new.refresh.token');
    mockSessionDAO.invalidatePreviousToken.mockResolvedValue(undefined);
    mockSessionDAO.storeRefreshToken.mockResolvedValue(true);

    const result = await refreshToken.call(payload);

    expect(mockSessionDAO.invalidatePreviousToken).toHaveBeenCalledWith({ _id: userId });
    expect(mockSessionDAO.storeRefreshToken).toHaveBeenCalledWith(storedUser, {
      refreshToken: 'new.refresh.token',
    });
    expect(result).toEqual({
      _id: userId,
      success: true,
      token: 'new.access.token',
      refreshToken: 'new.refresh.token',
    });
  });
});
