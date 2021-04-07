import { CustomError } from './custom-error';

export class InvalidResponseError extends CustomError {
  static status = 500;
  static code = 'invalidResponse';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(InvalidResponseError.status, InvalidResponseError.code, messageOrParams, params);
  }
}
