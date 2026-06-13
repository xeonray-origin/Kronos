import { User } from '@/entities';
import { Schema, Types } from 'mongoose';

export type SessionInfo = {
  _id?: Types.ObjectId;
  refreshToken?: string;
};

export interface ISessionDAO {
  storeRefreshToken(user: Pick<User, '_id'>, sessionInfo: SessionInfo): Promise<boolean>;
  invalidatePreviousToken(sessionInfo: SessionInfo): Promise<void>;
}
