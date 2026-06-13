import { Types } from 'mongoose';
import SessionDAO from '../../src/dao/session.dao';
import { Session as SessionModel } from '@/models';
import type { SessionInfo } from '@/interfaces/auth.interface';

jest.mock('@/models', () => ({
  Session: {
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

const mockFindOneAndUpdate = SessionModel.findOneAndUpdate as jest.Mock;
const mockFindOneAndDelete = SessionModel.findOneAndDelete as jest.Mock;

describe('SessionDAO', () => {
  let dao: SessionDAO;

  beforeEach(() => {
    dao = new SessionDAO();
    jest.clearAllMocks();
  });

  describe('storeRefreshToken', () => {
    const userId = new Types.ObjectId();
    const user = { _id: userId };
    const sessionInfo: SessionInfo = { refreshToken: 'token.refresh.xyz' };

    it('upserts a session document with the correct fields', async () => {
      mockFindOneAndUpdate.mockResolvedValueOnce({});

      await dao.storeRefreshToken(user, sessionInfo);

      expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        { _id: userId, refreshToken: sessionInfo.refreshToken },
        { upsert: true },
      );
    });

    it('returns true on success', async () => {
      mockFindOneAndUpdate.mockResolvedValueOnce({});
      const result = await dao.storeRefreshToken(user, sessionInfo);
      expect(result).toBe(true);
    });

    it('propagates errors thrown by the model', async () => {
      mockFindOneAndUpdate.mockRejectedValueOnce(new Error('DB write failed'));
      await expect(dao.storeRefreshToken(user, sessionInfo)).rejects.toThrow('DB write failed');
    });
  });

  describe('invalidatePreviousToken', () => {
    const userId = new Types.ObjectId();
    const sessionInfo: SessionInfo = { _id: userId };

    it('deletes the session document for the given id', async () => {
      mockFindOneAndDelete.mockResolvedValueOnce({});

      await dao.invalidatePreviousToken(sessionInfo);

      expect(mockFindOneAndDelete).toHaveBeenCalledTimes(1);
      expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: userId });
    });

    it('propagates errors thrown by the model', async () => {
      mockFindOneAndDelete.mockRejectedValueOnce(new Error('DB delete failed'));
      await expect(dao.invalidatePreviousToken(sessionInfo)).rejects.toThrow('DB delete failed');
    });
  });
});
