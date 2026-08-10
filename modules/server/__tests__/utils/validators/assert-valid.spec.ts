import { assertValid } from '@/utils/validators/assert-valid';
import { IValidator } from '@/interfaces';
import { ZodError } from 'zod';

type Payload = { title: string };

const mockValidator: IValidator<Payload> = { validate: jest.fn() };
const payload: Payload = { title: 'Fix bug' };

describe('assertValid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the validated value when the payload is valid', () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({ isValid: true, value: payload });

    expect(assertValid(mockValidator, payload)).toEqual(payload);
  });

  it('throws with joined messages from a ZodError', () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      value: payload,
      errors: new ZodError([
        { code: 'custom', path: ['title'], message: 'Title is required and cannot be empty' },
        { code: 'custom', path: ['userId'], message: 'userId is required' },
      ]),
    });

    expect(() => assertValid(mockValidator, payload)).toThrow(
      'Validation failed: Title is required and cannot be empty, userId is required',
    );
  });

  it('throws with joined messages when errors are a plain string array', () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({
      isValid: false,
      value: payload,
      errors: ['Title is required and cannot be empty'],
    });

    expect(() => assertValid(mockValidator, payload)).toThrow(
      'Validation failed: Title is required and cannot be empty',
    );
  });

  it('throws with no messages when errors are omitted', () => {
    (mockValidator.validate as jest.Mock).mockReturnValueOnce({ isValid: false, value: payload });

    expect(() => assertValid(mockValidator, payload)).toThrow('Validation failed: ');
  });
});
