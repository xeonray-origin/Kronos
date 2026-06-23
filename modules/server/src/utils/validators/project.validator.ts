import * as z from 'zod';
import Validator from './validator';

const projectSchema = z.object({
  name: z.string().min(1),
  emoji: z.string().optional(),
  shared: z.boolean().default(false),
  count: z.number().int().nonnegative().default(0),
  userId: z.any(),
});

export default new Validator(projectSchema);
