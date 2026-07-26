import { Schema, Types } from 'mongoose';
import client from './client';

const labelSchema = new Schema(
  {
    labels: { type: [String], default: [] },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Label = client.model('Label', labelSchema);

export { labelSchema, Label };
