import LoginUser from '@/actions/user/login';
import { AuthUser, User } from '@/entities';
import { IJwtToken, IPasswordHasher, ISessionDAO, IUserDAO, IValidator } from '@/interfaces';
import { Types } from 'mongoose';

const makeUser = (fields: Partial<AuthUser> = {}): AuthUser =>
  Object.assign(Object.create(AuthUser.prototype), fields);

describe('LoginUser', () => {
  let loginUser: LoginUser;
  let mockValidator: jest.Mocked<IValidator<AuthUser>>;
  let mockUserDAO: jest.Mocked<IUserDAO>;
  let mockSessionDAO: jest.Mocked<ISessionDAO>;
  let mockPasswordHasher: jest.Mocked<IPasswordHasher>;
  let mockVerifyLegacyPassword: jest.MockedFunction<
    (password: string, salt: string, storedHash: string) => Promise<boolean>
  >;
  let mockJwtToken: jest.Mocked<IJwtToken>;

  const payload = { email: 'test@example.com', password: 'password123' };
  const userId = new Types.ObjectId();
  const upgradedHash = '$argon2id$v=19$m=19456,t=2,p=1$bmV3c2FsdA$bmV3aGFzaA';
  const legacyUser = makeUser({
    _id: userId,
    email: 'test@example.com',
    password: 'a3f1c0ffee',
    salt: 'salt_abc',
  });
  const modernUser = makeUser({
    _id: userId,
    email: 'test@example.com',
    password: '$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA',
  });

  const givenValidLogin = (user: AuthUser) => {
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload as any });
    mockUserDAO.findAuthByEmail.mockResolvedValue(user);
    mockJwtToken.generateToken.mockResolvedValue('signed.jwt.token');
    mockJwtToken.generateRefreshToken.mockResolvedValue('signed.refresh.token');
    mockSessionDAO.storeRefreshToken.mockResolvedValue(true);
  };

  const expectedResult = {
    success: true,
    token: 'signed.jwt.token',
    refreshToken: 'signed.refresh.token',
    maxCookieAge: expect.any(Number),
  };

  beforeEach(() => {
    mockValidator = { validate: jest.fn() };
    mockUserDAO = {
      create: jest.fn(),
      storePasswordHash: jest.fn(),
      updatePasswordHash: jest.fn(),
      findByEmail: jest.fn(),
      findAuthByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockSessionDAO = { storeRefreshToken: jest.fn(), invalidatePreviousToken: jest.fn() };
    mockPasswordHasher = {
      hash: jest.fn(),
      verify: jest.fn(),
      isCurrentFormat: jest.fn((storedHash: string) => storedHash.startsWith('$argon2')),
    };
    mockVerifyLegacyPassword = jest.fn();
    mockJwtToken = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      base64UrlEncode: jest.fn(),
      base64UrlDecode: jest.fn(),
    };
    loginUser = new LoginUser(
      mockValidator,
      mockUserDAO,
      mockSessionDAO,
      mockPasswordHasher,
      mockVerifyLegacyPassword,
      mockJwtToken,
    );
  });

  it('throws ValidationError when validation fails with array errors', async () => {
    mockValidator.validate.mockReturnValue({
      isValid: false,
      errors: ['email is invalid'],
      value: payload as any,
    });
    await expect(loginUser.call(payload)).rejects.toThrow('Validation failed: email is invalid');
    expect(mockUserDAO.findAuthByEmail).not.toHaveBeenCalled();
  });

  it('throws ValidationError when validation fails with ZodError format', async () => {
    mockValidator.validate.mockReturnValue({
      isValid: false,
      errors: { issues: [{ message: 'Invalid email' }] } as any,
      value: payload as any,
    });
    await expect(loginUser.call(payload)).rejects.toThrow('Validation failed: Invalid email');
  });

  it('throws ValidationError when user is not found', async () => {
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload as any });
    mockUserDAO.findAuthByEmail.mockResolvedValue(null);
    await expect(loginUser.call(payload)).rejects.toThrow('Invalid email or password');
    expect(mockVerifyLegacyPassword).not.toHaveBeenCalled();
    expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
  });

  describe('with a legacy SHA-256 hash', () => {
    it('verifies with the legacy method, then stores an argon2 hash', async () => {
      givenValidLogin(legacyUser);
      mockVerifyLegacyPassword.mockResolvedValue(true);
      mockPasswordHasher.hash.mockResolvedValue(upgradedHash);

      const result = await loginUser.call(payload);

      expect(mockVerifyLegacyPassword).toHaveBeenCalledWith(
        payload.password,
        legacyUser.salt,
        legacyUser.password,
      );
      expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(payload.password);
      expect(mockUserDAO.updatePasswordHash).toHaveBeenCalledWith(userId, upgradedHash);
      expect(mockSessionDAO.storeRefreshToken).toHaveBeenCalledWith(legacyUser, {
        refreshToken: 'signed.refresh.token',
      });
      expect(result).toEqual(expectedResult);
    });

    it('verifies against an empty salt when the record has none', async () => {
      givenValidLogin(makeUser({ _id: userId, password: 'a3f1c0ffee' }));
      mockVerifyLegacyPassword.mockResolvedValue(false);

      await expect(loginUser.call(payload)).rejects.toThrow('Invalid email or password');
      expect(mockVerifyLegacyPassword).toHaveBeenCalledWith(payload.password, '', 'a3f1c0ffee');
    });

    it('throws and does not rehash when the password is incorrect', async () => {
      givenValidLogin(legacyUser);
      mockVerifyLegacyPassword.mockResolvedValue(false);

      await expect(loginUser.call(payload)).rejects.toThrow('Invalid email or password');
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUserDAO.updatePasswordHash).not.toHaveBeenCalled();
      expect(mockJwtToken.generateToken).not.toHaveBeenCalled();
    });

    it('still logs the user in when storing the upgraded hash fails', async () => {
      givenValidLogin(legacyUser);
      mockVerifyLegacyPassword.mockResolvedValue(true);
      mockPasswordHasher.hash.mockResolvedValue(upgradedHash);
      mockUserDAO.updatePasswordHash.mockRejectedValue(new Error('write failed'));

      await expect(loginUser.call(payload)).resolves.toEqual(expectedResult);
    });
  });

  describe('with an argon2 hash', () => {
    it('verifies with argon2 and leaves the stored hash untouched', async () => {
      givenValidLogin(modernUser);
      mockPasswordHasher.verify.mockResolvedValue(true);

      const result = await loginUser.call(payload);

      expect(mockPasswordHasher.verify).toHaveBeenCalledWith(modernUser.password, payload.password);
      expect(mockVerifyLegacyPassword).not.toHaveBeenCalled();
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUserDAO.updatePasswordHash).not.toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('throws when the password is incorrect', async () => {
      givenValidLogin(modernUser);
      mockPasswordHasher.verify.mockResolvedValue(false);

      await expect(loginUser.call(payload)).rejects.toThrow('Invalid email or password');
      expect(mockJwtToken.generateToken).not.toHaveBeenCalled();
    });
  });
});
