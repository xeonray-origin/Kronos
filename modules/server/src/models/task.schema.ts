import { Schema, Types } from 'mongoose';
import client from './client';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    labels: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['BACKLOG', 'DONE'],
      default: 'BACKLOG',
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = client.model('Task', taskSchema);

export { taskSchema, Task };
