import { Schema } from 'mongoose';
import User from './user.entity';

export default class AuthUser extends User {
  password!: string;
  salt!: string;
  confirmPassword?: string;
}
