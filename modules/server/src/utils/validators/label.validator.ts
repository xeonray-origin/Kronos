import * as z from 'zod';
import Validator from './validator';

const labelSchema = z.object({
  labels: z.array(z.string()).default([]),
  userId: z.any(),
});

const labelUpdateSchema = z.object({
  labels: z.array(z.string()),
});

export const labelUpdateValidator = new Validator(labelUpdateSchema);

export default new Validator(labelSchema);
