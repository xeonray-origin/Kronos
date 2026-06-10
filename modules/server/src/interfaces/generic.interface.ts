export interface IValidationResult<T> {
  errors?: string[];
  value: T;
  isValid: boolean;
}

export interface IError {
  message: string;
  httpStatusCode?: number;
  details?: string;
}

export interface IValidator<T> {
  validate(input: T): IValidationResult<T>;
}

export interface IAction<T> {
  call(...args: unknown[]): T | Promise<T>;
}
