import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  static status = 401;
  static code = 'unauthorized';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(UnauthorizedError.status, UnauthorizedError.code, messageOrParams, params);
  }
}
