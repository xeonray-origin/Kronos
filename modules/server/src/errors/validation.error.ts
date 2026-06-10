import { IError } from '@/interfaces';

export class ValidationError extends Error implements IError {
  public type = 'ValidationError';

  constructor(
    public override message: string = 'Provided data is invalid',
    public details?: string,
    public httpStatusCode: number = 422,
  ) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }
}
