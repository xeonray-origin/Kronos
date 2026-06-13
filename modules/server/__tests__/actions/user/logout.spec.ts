import LogoutUser from '@/actions/user/logout';
import { SessionPayload } from '@/entities';
import { IJwtToken, ISessionDAO } from '@/interfaces';
import { Types } from 'mongoose';

const makeSessionPayload = (fields: Partial<SessionPayload> = {}): SessionPayload =>
  Object.assign(Object.create(SessionPayload.prototype), fields);

describe('LogoutUser', () => {
  let logoutUser: LogoutUser;
  let mockSessionDAO: jest.Mocked<ISessionDAO>;
  let mockJwtToken: jest.Mocked<IJwtToken>;

  const userId = new Types.ObjectId();
  const payload = makeSessionPayload({ refreshToken: 'some.refresh.token' });
  const decodedPayload = {
    exp: 9999999999,
    userId: userId.toString(),
    email: 'user@example.com',
    role: 'user',
  };

  beforeEach(() => {
    mockSessionDAO = { storeRefreshToken: jest.fn(), invalidatePreviousToken: jest.fn() };
    mockJwtToken = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      base64UrlEncode: jest.fn(),
      base64UrlDecode: jest.fn(),
    };
    logoutUser = new LogoutUser(mockSessionDAO, mockJwtToken);
  });

  it('throws 401 ValidationError when refresh token is invalid', async () => {
    mockJwtToken.verifyRefreshToken.mockResolvedValue(null);
    await expect(logoutUser.call(payload)).rejects.toMatchObject({
      message: 'Unauthorized!',
      httpStatusCode: 401,
    });
    expect(mockSessionDAO.invalidatePreviousToken).not.toHaveBeenCalled();
  });

  it('invalidates the session and returns success on valid token', async () => {
    mockJwtToken.verifyRefreshToken.mockResolvedValue(decodedPayload);
    mockSessionDAO.invalidatePreviousToken.mockResolvedValue(undefined);

    const result = await logoutUser.call(payload);

    expect(mockSessionDAO.invalidatePreviousToken).toHaveBeenCalledWith({
      _id: new Types.ObjectId(userId.toString()),
    });
    expect(result).toEqual({ success: true });
  });
});
