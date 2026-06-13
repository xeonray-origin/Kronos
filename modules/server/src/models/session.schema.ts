import { Schema } from 'mongoose';
import client from './client';
const sessionSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: false,
    },
    lastActiveOn: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

const Session = client.model('Session', sessionSchema);

export { sessionSchema, Session };
