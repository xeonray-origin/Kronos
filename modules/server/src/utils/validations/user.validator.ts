import * as z from 'zod';
import Validator from './validator';

const userValidator = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['user', 'admin']),
    phoneNumber: z.string().min(10).max(15),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export default new Validator(userValidator);
