import { RegisterUser } from '@/actions';
import { IValidator, IUserDAO } from '@/interfaces';
import { AuthUser, User } from '@/entities';
import { Types } from 'mongoose';

const makeUser = (fields: Partial<User> = {}): User =>
  Object.assign(Object.create(User.prototype), fields);

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let mockValidator: jest.Mocked<IValidator<AuthUser>>;
  let mockUserDAO: jest.Mocked<IUserDAO>;
  let mockEncryptPassword: jest.MockedFunction<
    (password: string) => Promise<{ password: string; salt: string }>
  >;

  const payload = {
    email: 'test@example.com',
    name: { firstName: 'John', lastName: 'Doe' },
    password: 'password123',
    confirmPassword: 'password123',
    role: 'user',
    salt: '',
    phoneNumber: '1234567890',
  };

  const encryptedPassword = { password: 'hashed_pw', salt: 'salt_abc' };

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
    mockEncryptPassword = jest.fn();
    registerUser = new RegisterUser(mockValidator, mockUserDAO, mockEncryptPassword);
  });

  it('throws when email is missing', async () => {
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload });
    await expect(registerUser.call({ ...payload, email: '' })).rejects.toThrow('missing email id');
  });

  it('throws ValidationError when validation fails with array errors', async () => {
    mockValidator.validate.mockReturnValue({
      isValid: false,
      errors: ['email is invalid', 'password too weak'],
      value: payload,
    });
    await expect(registerUser.call(payload)).rejects.toThrow(
      'Validation failed: email is invalid, password too weak',
    );
    expect(mockUserDAO.findByEmail).not.toHaveBeenCalled();
  });

  it('throws ValidationError when validation fails with ZodError format', async () => {
    mockValidator.validate.mockReturnValue({
      isValid: false,
      errors: {
        issues: [{ message: 'email is invalid' }, { message: 'password too weak' }],
      } as any,
      value: payload,
    });
    await expect(registerUser.call(payload)).rejects.toThrow(
      'Validation failed: email is invalid, password too weak',
    );
  });

  it('throws ValidationError when email already exists', async () => {
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload });
    mockUserDAO.findByEmail.mockResolvedValue(makeUser({ email: payload.email }));
    await expect(registerUser.call(payload)).rejects.toThrow('User with this email already exists');
    expect(mockEncryptPassword).not.toHaveBeenCalled();
  });

  it('creates user and stores password hash when _id is present', async () => {
    const createdUser = makeUser({ _id: new Types.ObjectId() as any });
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload });
    mockUserDAO.findByEmail.mockResolvedValue(null);
    mockEncryptPassword.mockResolvedValue(encryptedPassword);
    mockUserDAO.create.mockResolvedValue(createdUser);
    mockUserDAO.storePasswordHash.mockResolvedValue({} as AuthUser);

    const result = await registerUser.call(payload);

    expect(mockEncryptPassword).toHaveBeenCalledWith(payload.password);
    expect(mockUserDAO.create).toHaveBeenCalled();
    const createArg = mockUserDAO.create.mock.calls[0]![0] as any;
    expect(createArg).not.toHaveProperty('confirmPassword');
    expect(createArg.password).toBe(encryptedPassword.password);
    expect(mockUserDAO.storePasswordHash).toHaveBeenCalledWith({
      _id: createdUser._id,
      password: encryptedPassword.password,
      salt: encryptedPassword.salt,
    });
    expect(result).toBe(createdUser);
  });

  it('skips storePasswordHash when created user has no _id', async () => {
    const createdUser = makeUser();
    mockValidator.validate.mockReturnValue({ isValid: true, value: payload });
    mockUserDAO.findByEmail.mockResolvedValue(null);
    mockEncryptPassword.mockResolvedValue(encryptedPassword);
    mockUserDAO.create.mockResolvedValue(createdUser);

    await registerUser.call(payload);

    expect(mockUserDAO.storePasswordHash).not.toHaveBeenCalled();
  });
});
