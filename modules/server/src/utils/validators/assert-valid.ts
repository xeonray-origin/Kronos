import { ValidationError } from '@/errors';
import { IValidator } from '@/interfaces';

export function assertValid<T>(validator: IValidator<T>, payload: Partial<T>): T {
  const { isValid, errors = [], value } = validator.validate(payload);
  if (!isValid) {
    const messages = Array.isArray(errors) ? errors : errors.issues.map((issue) => issue.message);
    throw new ValidationError(`Validation failed: ${messages.join(', ')}`);
  }
  return value;
}
