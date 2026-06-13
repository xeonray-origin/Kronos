import { ValidationError } from '@/errors';

describe('ValidationError', () => {
  it('uses default message and httpStatusCode when called with no arguments', () => {
    const err = new ValidationError();

    expect(err.message).toBe('Provided data is invalid');
    expect(err.httpStatusCode).toBe(422);
    expect(err.type).toBe('ValidationError');
  });

  it('sets all fields when called with explicit arguments', () => {
    const err = new ValidationError('Custom msg', 'some detail', 401);

    expect(err.message).toBe('Custom msg');
    expect(err.details).toBe('some detail');
    expect(err.httpStatusCode).toBe(401);
  });

  it('is an instance of Error', () => {
    expect(new ValidationError()).toBeInstanceOf(Error);
  });
});
