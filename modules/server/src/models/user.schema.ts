import { Schema } from 'mongoose';
import client from './client';

const userSchema = new Schema(
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
  },
  {
    timestamps: true,
  },
);

const User = client.model('User', userSchema);

export { userSchema, User };
