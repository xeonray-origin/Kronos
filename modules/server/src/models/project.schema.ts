import { Schema, Types } from 'mongoose';
import client from './client';

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    emoji: { type: String },
    shared: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Project = client.model('Project', projectSchema);

export { projectSchema, Project };
