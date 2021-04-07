import { CustomError } from './custom-error';

export class AccessDeniedError extends CustomError {
  static status = 403;
  static code = 'accessDenied';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(AccessDeniedError.status, AccessDeniedError.code, messageOrParams, params);
  }
}
