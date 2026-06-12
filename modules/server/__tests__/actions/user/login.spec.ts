import LoginUser from '@/actions/user/login';
import { AuthUser, User } from '@/entities';
import { IJwtToken, ISessionDAO, IUserDAO, IValidator } from '@/interfaces';

const makeUser = (fields: Partial<AuthUser> = {}): AuthUser =>
  Object.assign(Object.create(AuthUser.prototype), fields);

describe('LoginUser', () => {
  let loginUser: LoginUser;
  let mockValidator: jest.Mocked<IValidator<AuthUser>>;
  let mockUserDAO: jest.Mocked<IUserDAO>;
  let mockSessionDAO: jest.Mocked<ISessionDAO>;
  let mockVerifyPassword: jest.MockedFunction<
    (password: string, salt: string, storedHash: string) => Promise<boolean>
  >;
  let mockJwtToken: jest.Mocked<IJwtToken>;

  const payload = { email: 'test@example.com', password: 'password123' };
  const storedUser = makeUser({
    email: 'test@example.com',
    password: 'hashed_pw',
    salt: 'salt_abc',
  });

  beforeEach(() => {
    mockValidator = { validate: jest.fn() };
    mockUserDAO = {
      create: jest.fn(),
      storePasswordHash: jest.fn(),
      findByEmail: jest.fn(),
      findAuthByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockSessionDAO = { storeRefreshToken: jest.fn() };
    mockVerifyPassword = jest.fn();
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
      mockVerifyPassword,
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
    expect(mockVerifyPassword).not.toHaveBeenCalled();
  });

  it('throws ValidationError when password is incorrect', async () => {
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload as any });
    mockUserDAO.findAuthByEmail.mockResolvedValue(storedUser);
    mockVerifyPassword.mockResolvedValue(false);
    await expect(loginUser.call(payload)).rejects.toThrow('Invalid email or password');
    expect(mockJwtToken.generateToken).not.toHaveBeenCalled();
  });

  it('returns success and token on valid credentials', async () => {
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload as any });
    mockUserDAO.findAuthByEmail.mockResolvedValue(storedUser);
    mockVerifyPassword.mockResolvedValue(true);
    mockJwtToken.generateToken.mockResolvedValue('signed.jwt.token');
    mockJwtToken.generateRefreshToken.mockResolvedValue('signed.refresh.token');
    mockSessionDAO.storeRefreshToken.mockResolvedValue(true);

    const result = await loginUser.call(payload);

    expect(mockVerifyPassword).toHaveBeenCalledWith(
      payload.password,
      storedUser.salt,
      storedUser.password,
    );
    expect(mockJwtToken.generateToken).toHaveBeenCalled();
    expect(mockJwtToken.generateRefreshToken).toHaveBeenCalled();
    expect(mockSessionDAO.storeRefreshToken).toHaveBeenCalledWith(
      storedUser,
      expect.objectContaining({ refreshToken: 'signed.refresh.token', isActive: true }),
    );
    expect(result).toEqual({ success: true, token: 'signed.jwt.token' });
  });
});
