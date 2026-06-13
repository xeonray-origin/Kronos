import { Types } from 'mongoose';
import { UserDAO } from '@/dao/user.dao';
import { User as UserModel, AuthUser as AuthUserModel } from '@/models';

jest.mock('@/models', () => {
  const MockAuthUser = jest.fn();
  (MockAuthUser as any).findById = jest.fn();
  return {
    User: {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    },
    AuthUser: MockAuthUser,
  };
});

const mockCreate = UserModel.create as jest.Mock;
const mockFindOne = UserModel.findOne as jest.Mock;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock;
const mockFindByIdAndDelete = UserModel.findByIdAndDelete as jest.Mock;
const mockAuthUserClass = AuthUserModel as unknown as jest.Mock;
const mockAuthUserFindById = (AuthUserModel as any).findById as jest.Mock;

describe('UserDAO', () => {
  let dao: UserDAO;

  const userId = new Types.ObjectId();
  const userDoc = {
    _id: userId,
    toObject: () => ({ _id: userId, email: 'test@example.com' }),
  };
  const authDoc = {
    _id: userId,
    toObject: () => ({ _id: userId, password: 'hashed', salt: 'abc' }),
  };

  beforeEach(() => {
    dao = new UserDAO();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('returns the created user', async () => {
      mockCreate.mockResolvedValueOnce(userDoc);

      const result = await dao.create({ email: 'test@example.com' } as any);

      expect(mockCreate).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(userDoc);
    });
  });

  describe('storePasswordHash', () => {
    it('saves a new AuthUser document and returns its plain object', async () => {
      const savedDoc = { toObject: () => ({ _id: userId, password: 'hashed', salt: 'abc' }) };
      const mockSave = jest.fn().mockResolvedValueOnce(savedDoc);
      mockAuthUserClass.mockImplementationOnce(() => ({ save: mockSave }));

      const input = { _id: userId, password: 'hashed', salt: 'abc' } as any;
      const result = await dao.storePasswordHash(input);

      expect(mockAuthUserClass).toHaveBeenCalledWith(input);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(savedDoc.toObject());
    });
  });

  describe('findByEmail', () => {
    it('returns null when no user matches the email', async () => {
      mockFindOne.mockResolvedValueOnce(null);

      const result = await dao.findByEmail('missing@example.com');

      expect(result).toBeNull();
    });

    it('returns the user plain object when found', async () => {
      mockFindOne.mockResolvedValueOnce(userDoc);

      const result = await dao.findByEmail('test@example.com');

      expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(userDoc.toObject());
    });
  });

  describe('findAuthByEmail', () => {
    it('returns null when the user record is not found', async () => {
      mockFindOne.mockResolvedValueOnce(null);

      const result = await dao.findAuthByEmail('missing@example.com');

      expect(result).toBeNull();
      expect(mockAuthUserFindById).not.toHaveBeenCalled();
    });

    it('returns null when the auth record is not found', async () => {
      mockFindOne.mockResolvedValueOnce(userDoc);
      mockAuthUserFindById.mockResolvedValueOnce(null);

      const result = await dao.findAuthByEmail('test@example.com');

      expect(result).toBeNull();
    });

    it('returns merged user and auth objects when both are found', async () => {
      mockFindOne.mockResolvedValueOnce(userDoc);
      mockAuthUserFindById.mockResolvedValueOnce(authDoc);

      const result = await dao.findAuthByEmail('test@example.com');

      expect(mockAuthUserFindById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ ...userDoc.toObject(), ...authDoc.toObject() });
    });
  });

  describe('findById', () => {
    it('returns null when no user matches the id', async () => {
      mockUserFindById.mockResolvedValueOnce(null);

      const result = await dao.findById(1);

      expect(result).toBeNull();
    });

    it('returns the user plain object when found', async () => {
      mockUserFindById.mockResolvedValueOnce(userDoc);

      const result = await dao.findById(1);

      expect(mockUserFindById).toHaveBeenCalledWith(1);
      expect(result).toEqual(userDoc.toObject());
    });
  });

  describe('update', () => {
    it('returns the updated user when found', async () => {
      mockFindByIdAndUpdate.mockResolvedValueOnce(userDoc);

      const result = await dao.update(1, { email: 'new@example.com' } as any);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        1,
        { email: 'new@example.com' },
        { new: true },
      );
      expect(result).toEqual(userDoc.toObject());
    });

    it('returns an empty object when the user is not found', async () => {
      mockFindByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await dao.update(1, {});

      expect(result).toEqual({});
    });
  });

  describe('delete', () => {
    it('calls findByIdAndDelete with the given id', async () => {
      mockFindByIdAndDelete.mockResolvedValueOnce(null);

      await dao.delete(1);

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(1);
    });
  });
});
