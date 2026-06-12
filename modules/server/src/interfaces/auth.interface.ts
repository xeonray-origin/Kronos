import { User } from '@/entities';
import { Schema } from 'mongoose';

export type SessionInfo = {
  refreshToken: string;
  isActive: boolean;
  lastActiveOn: string;
};

export interface ISessionDAO {
  storeRefreshToken(user: Pick<User, '_id'>, sessionInfo: SessionInfo): Promise<boolean>;
}
