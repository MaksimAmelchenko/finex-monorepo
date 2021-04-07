import { CustomError } from './custom-error';

export class InternalError extends CustomError {
  static status = 500;
  static code = 'internalError';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(InternalError.status, InternalError.code, messageOrParams, params);
  }
}
