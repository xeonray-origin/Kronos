import { Schema } from 'mongoose';
import { client } from '@/dao/client';
const authSchema = new Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const AuthUser = client.model('AuthUser', authSchema);

export { authSchema, AuthUser };
