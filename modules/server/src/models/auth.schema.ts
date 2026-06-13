import { Schema } from 'mongoose';
import client from './client';

const authSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

const AuthUser = client.model('AuthUser', authSchema);

export { authSchema, AuthUser };
