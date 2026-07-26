import { Schema, Types } from 'mongoose';
import client from './client';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
    },
    labels: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['TODO', 'IN-PROGRESS', 'DONE', 'BACKLOG'],
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
