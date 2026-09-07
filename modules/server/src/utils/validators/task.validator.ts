import * as z from 'zod';
import Validator from './validator';

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required and cannot be empty')
    .max(255, 'Title must not exceed 255 characters'),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Due date is not a valid date')
    .optional(),
  labels: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Label cannot be empty')
        .max(50, 'Label must not exceed 50 characters'),
    )
    .max(10, 'Maximum 10 labels allowed')
    .optional(),
  status: z.enum(['BACKLOG', 'DONE'], 'Status must be BACKLOG or DONE').optional(),
  userId: z.string().min(1, 'userId is required'),
});

const taskUpdateSchema = taskSchema
  .omit({ userId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be provided');

const taskTimeSchema = z.object({
  durationSeconds: z
    .number()
    .int('Duration must be a whole number of seconds')
    .positive('Duration must be greater than zero')
    .max(86400, 'Duration must not exceed 24 hours'),
});

export const taskUpdateValidator = new Validator(taskUpdateSchema);

export const taskTimeValidator = new Validator(taskTimeSchema);

export default new Validator(taskSchema);
