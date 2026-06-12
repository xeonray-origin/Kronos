import * as z from 'zod';
import Validator from './validator';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default new Validator(loginSchema);
