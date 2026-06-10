import { RegisterUser } from '@/actions';
import { IValidator, IUserDAO } from '@/interfaces';
import { AuthUser, User } from '@/entities';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let mockValidator: jest.Mocked<IValidator<any>>;
  let mockUserDAO: jest.Mocked<IUserDAO>;
  let mockEncryptPassword: jest.MockedFunction<
    (password: string) => Promise<{ password: string; salt: string }>
  >;

  const validPayload = {
    id: 1,
    email: 'test@example.com',
    name: { firstName: 'John', lastName: 'Doe' },
    password: 'password123',
    confirmPassword: 'password123',
    role: 'user',
    salt: '',
    phoneNumber: '1234567890',
  };

  beforeEach(() => {
    mockValidator = {
      validate: jest.fn(),
    };

    mockUserDAO = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockEncryptPassword = jest.fn();

    registerUser = new RegisterUser(mockValidator, mockUserDAO, mockEncryptPassword);
  });

  describe('successful registration', () => {
    it('should create a new user with valid data', async () => {
      const encryptedPassword = { password: 'hashed_password', salt: 'salt_123' };
      const createdUser = new AuthUser({
        ...validPayload,
        password: encryptedPassword.password,
      } as AuthUser);

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: validPayload,
      });

      mockUserDAO.findByEmail.mockResolvedValue(null);
      mockEncryptPassword.mockResolvedValue(encryptedPassword);
      mockUserDAO.create.mockResolvedValue(createdUser);

      const result = await registerUser.call(validPayload);

      expect(mockValidator.validate).toHaveBeenCalledWith(validPayload);
      expect(mockUserDAO.findByEmail).toHaveBeenCalledWith(validPayload.email);
      expect(mockEncryptPassword).toHaveBeenCalledWith(validPayload.password);
      expect(mockUserDAO.create).toHaveBeenCalled();
      expect(result).toBe(createdUser);
    });

    it('should pass encrypted password and salt to userDAO.create', async () => {
      const encryptedPassword = { password: 'hashed_password', salt: 'salt_123' };
      const createdUser = new AuthUser({
        ...validPayload,
        password: encryptedPassword.password,
        salt: encryptedPassword.salt,
      } as AuthUser);

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: validPayload,
      });

      mockUserDAO.findByEmail.mockResolvedValue(null);
      mockEncryptPassword.mockResolvedValue(encryptedPassword);
      mockUserDAO.create.mockResolvedValue(createdUser);

      await registerUser.call(validPayload);

      const createCallPayload = mockUserDAO.create.mock.calls[0]![0] as AuthUser;
      expect(createCallPayload.password).toBe(encryptedPassword.password);
      expect(createCallPayload.salt).toBe(encryptedPassword.salt);
    });

    it('should not include confirmPassword in final payload', async () => {
      const encryptedPassword = { password: 'hashed_password', salt: 'salt_123' };
      const createdUser = new AuthUser({
        ...validPayload,
        password: encryptedPassword.password,
      } as AuthUser);

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: validPayload,
      });

      mockUserDAO.findByEmail.mockResolvedValue(null);
      mockEncryptPassword.mockResolvedValue(encryptedPassword);
      mockUserDAO.create.mockResolvedValue(createdUser);

      await registerUser.call(validPayload);

      const createCallPayload = mockUserDAO.create.mock.calls[0]![0];
      expect(createCallPayload).not.toHaveProperty('confirmPassword');
    });
  });

  describe('validation errors', () => {
    it('should throw error when validation fails with array errors', async () => {
      const validationErrors = ['email is invalid', 'password is too weak'];

      mockValidator.validate.mockReturnValue({
        isValid: false,
        errors: validationErrors,
        value: null,
      });

      await expect(registerUser.call(validPayload)).rejects.toThrow(
        'Validation failed: email is invalid, password is too weak',
      );

      expect(mockUserDAO.findByEmail).not.toHaveBeenCalled();
      expect(mockEncryptPassword).not.toHaveBeenCalled();
      expect(mockUserDAO.create).not.toHaveBeenCalled();
    });

    it('should throw error with single validation error', async () => {
      mockValidator.validate.mockReturnValue({
        isValid: false,
        errors: ['password is required'],
        value: null,
      });

      await expect(registerUser.call(validPayload)).rejects.toThrow(
        'Validation failed: password is required',
      );
    });

    it('should throw error when validation fails with Zod error format', async () => {
      const zodErrors = {
        issues: [{ message: 'email is invalid' }, { message: 'password is too weak' }],
      } as any;

      mockValidator.validate.mockReturnValue({
        isValid: false,
        errors: zodErrors,
        value: null,
      });

      await expect(registerUser.call(validPayload)).rejects.toThrow(
        'Validation failed: email is invalid, password is too weak',
      );

      expect(mockUserDAO.findByEmail).not.toHaveBeenCalled();
      expect(mockEncryptPassword).not.toHaveBeenCalled();
      expect(mockUserDAO.create).not.toHaveBeenCalled();
    });

    it('should throw error with single Zod validation error', async () => {
      const zodErrors = {
        issues: [{ message: 'password is required' }],
      } as any;

      mockValidator.validate.mockReturnValue({
        isValid: false,
        errors: zodErrors,
        value: null,
      });

      await expect(registerUser.call(validPayload)).rejects.toThrow(
        'Validation failed: password is required',
      );
    });

    it('should handle undefined errors gracefully', async () => {
      mockValidator.validate.mockReturnValue({
        isValid: false,
        errors: undefined,
        value: null,
      });

      await expect(registerUser.call(validPayload)).rejects.toThrow('Validation failed:');
    });
  });

  describe('duplicate email check', () => {
    it('should throw error when email already exists', async () => {
      const existingUser = new User({
        id: 2,
        email: validPayload.email,
        name: validPayload.name,
        phoneNumber: validPayload.phoneNumber,
        role: validPayload.role,
      });

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: validPayload,
      });

      mockUserDAO.findByEmail.mockResolvedValue(existingUser);

      await expect(registerUser.call(validPayload)).rejects.toThrow(
        'User with this email already exists',
      );

      expect(mockEncryptPassword).not.toHaveBeenCalled();
      expect(mockUserDAO.create).not.toHaveBeenCalled();
    });
  });

  describe('password encryption', () => {
    it('should call encryptPassword with the password from payload', async () => {
      const encryptedPassword = { password: 'hashed_password', salt: 'salt_123' };
      const createdUser = new AuthUser({
        ...validPayload,
        password: encryptedPassword.password,
      } as AuthUser);

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: validPayload,
      });

      mockUserDAO.findByEmail.mockResolvedValue(null);
      mockEncryptPassword.mockResolvedValue(encryptedPassword);
      mockUserDAO.create.mockResolvedValue(createdUser);

      await registerUser.call(validPayload);

      expect(mockEncryptPassword).toHaveBeenCalledWith(validPayload.password);
      expect(mockEncryptPassword).toHaveBeenCalledTimes(1);
    });

    it('should handle encryption errors', async () => {
      const encryptionError = new Error('Encryption failed');

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: validPayload,
      });

      mockUserDAO.findByEmail.mockResolvedValue(null);
      mockEncryptPassword.mockRejectedValue(encryptionError);

      await expect(registerUser.call(validPayload)).rejects.toThrow('Encryption failed');

      expect(mockUserDAO.create).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle payload with minimal required fields', async () => {
      const minimalPayload = {
        email: 'test@example.com',
        name: { firstName: 'John', lastName: 'Doe' },
        password: 'password123',
        confirmPassword: 'password123',
        role: 'user',
        salt: '',
        phoneNumber: '',
        id: 1,
      };

      const encryptedPassword = { password: 'hashed_password', salt: 'salt_123' };
      const createdUser = new AuthUser({
        ...minimalPayload,
        password: encryptedPassword.password,
      } as AuthUser);

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: minimalPayload,
      });

      mockUserDAO.findByEmail.mockResolvedValue(null);
      mockEncryptPassword.mockResolvedValue(encryptedPassword);
      mockUserDAO.create.mockResolvedValue(createdUser);

      const result = await registerUser.call(minimalPayload);

      expect(result).toBe(createdUser);
    });

    it('should handle case-sensitive email check', async () => {
      const upperCaseEmail = 'TEST@EXAMPLE.COM';

      mockValidator.validate.mockReturnValue({
        isValid: true,
        errors: undefined,
        value: { ...validPayload, email: upperCaseEmail },
      });

      mockUserDAO.findByEmail.mockResolvedValue(null);
      mockEncryptPassword.mockResolvedValue({ password: 'hashed_password', salt: 'salt_123' });
      mockUserDAO.create.mockResolvedValue(
        new User({
          id: validPayload.id,
          name: validPayload.name,
          email: upperCaseEmail,
          phoneNumber: validPayload.phoneNumber,
          role: validPayload.role,
        }),
      );

      await registerUser.call({ ...validPayload, email: upperCaseEmail });

      expect(mockUserDAO.findByEmail).toHaveBeenCalledWith(upperCaseEmail);
    });
  });
});
