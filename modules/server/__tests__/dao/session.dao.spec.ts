import { Types } from 'mongoose';
import SessionDAO from '../../src/dao/session.dao';
import { Session as SessionModel } from '@/models';
import type { SessionInfo } from '@/interfaces/auth.interface';

jest.mock('@/models', () => ({
  Session: {
    findOneAndUpdate: jest.fn(),
  },
}));

const mockFindOneAndUpdate = SessionModel.findOneAndUpdate as jest.Mock;

describe('SessionDAO', () => {
  let dao: SessionDAO;

  beforeEach(() => {
    dao = new SessionDAO();
    jest.clearAllMocks();
  });

  describe('storeRefreshToken', () => {
    const userId = new Types.ObjectId();
    const user = { _id: userId };
    const sessionInfo: SessionInfo = {
      refreshToken: 'token.refresh.xyz',
      isActive: true,
      lastActiveOn: '2026-06-12T00:00:00.000Z',
    };

    it('upserts a session document with the correct fields', async () => {
      mockFindOneAndUpdate.mockResolvedValueOnce({});

      await dao.storeRefreshToken(user, sessionInfo);

      expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        {
          _id: userId,
          refreshToken: sessionInfo.refreshToken,
          isActive: sessionInfo.isActive,
          lastActiveOn: sessionInfo.lastActiveOn,
        },
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
});
