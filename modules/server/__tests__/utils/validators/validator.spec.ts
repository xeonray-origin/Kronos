import { z } from 'zod';
import Validator from '@/utils/validators/validator';

const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

type TestShape = z.infer<typeof schema>;

describe('Validator', () => {
  let validator: Validator<TestShape>;

  beforeEach(() => {
    validator = new Validator(schema);
  });

  describe('validate', () => {
    it('returns isValid true and parsed value for valid input', () => {
      const result = validator.validate({ name: 'Alice', age: 30 });

      expect(result.isValid).toBe(true);
      expect(result.value).toEqual({ name: 'Alice', age: 30 });
      expect(result.errors).toBeUndefined();
    });

    it('returns isValid false and ZodError for missing required fields', () => {
      const result = validator.validate({});

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.value).toEqual({});
    });

    it('returns isValid false and ZodError for wrong field types', () => {
      const result = validator.validate({
        name: 'Alice',
        age: 'not-a-number' as unknown as number,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('returns isValid false when a string field violates min length', () => {
      const result = validator.validate({ name: '', age: 25 });

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('returns isValid false when a number field violates positive constraint', () => {
      const result = validator.validate({ name: 'Bob', age: -1 });

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('preserves the original input as value on failure', () => {
      const input = { name: '', age: -5 };
      const result = validator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.value).toEqual(input);
    });

    it('works with partial input when schema fields are optional', () => {
      const partialSchema = z.object({
        name: z.string().optional(),
        age: z.number().optional(),
      });
      const partialValidator = new Validator(partialSchema);

      const result = partialValidator.validate({});

      expect(result.isValid).toBe(true);
      expect(result.value).toEqual({});
    });
  });
});
