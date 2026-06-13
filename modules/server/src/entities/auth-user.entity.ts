import { Schema } from 'mongoose';
import { User } from './user.entity';

export class AuthUser extends User {
  password!: string;
  salt!: string;
  confirmPassword?: string;
}

export class SessionPayload {
  refreshToken!: string;
}
