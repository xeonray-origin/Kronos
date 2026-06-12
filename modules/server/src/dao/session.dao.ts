import { User } from '@/entities';
import { ISessionDAO } from '@/interfaces';
import { Session as SessionModel } from '@/models';
import { SessionInfo } from '@/interfaces/auth.interface';
import { Types } from 'mongoose';

export default class SessionDAO implements ISessionDAO {
  async storeRefreshToken(user: Pick<User, '_id'>, sessionInfo: SessionInfo) {
    const filter = { _id: user._id };
    const payload = {
      _id: user._id,
      refreshToken: sessionInfo.refreshToken,
      isActive: sessionInfo.isActive,
      lastActiveOn: sessionInfo.lastActiveOn,
    };
    const options = { upsert: true };
    await SessionModel.findOneAndUpdate(filter, payload, options);
    return true;
  }
}
