import * as z from 'zod';
import Validator from './validator';

const labelSchema = z.object({
  labels: z.array(z.string()).default([]),
  userId: z.any(),
});

export default new Validator(labelSchema);
