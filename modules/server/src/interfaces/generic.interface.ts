import z from 'zod';

export interface IValidationResult<T> {
  errors?: string[] | z.ZodError;
  value: T;
  isValid: boolean;
}

export interface IError {
  type: string;
  message: string;
  httpStatusCode?: number;
  details?: string;
}

export interface IValidator<T> {
  validate(input: Partial<T>): IValidationResult<T>;
}

export interface IAction<T> {
  call(...args: unknown[]): T | Promise<T>;
}

export interface IRequest {
  token?: string;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
}
