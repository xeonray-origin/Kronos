import { IValidationResult, IValidator } from '@/interfaces';
import { ZodType } from 'zod';

export default class Validator<T> implements IValidator<T> {
  constructor(protected schema: ZodType<T>) {}
  public validate(input: Partial<T>): IValidationResult<T> {
    const result = this.schema.safeParse(input);
    if (result.success) {
      return { value: result.data, isValid: true };
    }
    return {
      isValid: false,
      errors: result.error,
      value: input as T,
    };
  }
}
