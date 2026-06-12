import { ZodError } from 'zod';
import userValidator from '@/utils/validators/user.validator';

const validInput = {
  email: 'test@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
  name: { firstName: 'John', lastName: 'Doe' },
  role: 'user' as const,
  phoneNumber: '1234567890',
};

describe('userValidator', () => {
  it('accepts a fully valid payload', () => {
    const result = userValidator.validate(validInput);
    expect(result.isValid).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = userValidator.validate({ ...validInput, email: 'not-an-email' });
    expect(result.isValid).toBe(false);
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = userValidator.validate({
      ...validInput,
      password: 'abc',
      confirmPassword: 'abc',
    });
    expect(result.isValid).toBe(false);
  });

  it('rejects mismatched password and confirmPassword', () => {
    const result = userValidator.validate({ ...validInput, confirmPassword: 'different' });
    expect(result.isValid).toBe(false);
    expect((result.errors as ZodError<unknown>).issues[0]?.message).toBe('Passwords do not match');
  });

  it('rejects an empty firstName', () => {
    const result = userValidator.validate({
      ...validInput,
      name: { firstName: '', lastName: 'Doe' },
    });
    expect(result.isValid).toBe(false);
  });

  it('rejects an invalid role', () => {
    const result = userValidator.validate({ ...validInput, role: 'superuser' as never });
    expect(result.isValid).toBe(false);
  });

  it('rejects a phoneNumber shorter than 10 digits', () => {
    const result = userValidator.validate({ ...validInput, phoneNumber: '123' });
    expect(result.isValid).toBe(false);
  });

  it('rejects a phoneNumber longer than 15 digits', () => {
    const result = userValidator.validate({ ...validInput, phoneNumber: '1234567890123456' });
    expect(result.isValid).toBe(false);
  });

  it('accepts role "admin"', () => {
    const result = userValidator.validate({ ...validInput, role: 'admin' });
    expect(result.isValid).toBe(true);
  });
});
