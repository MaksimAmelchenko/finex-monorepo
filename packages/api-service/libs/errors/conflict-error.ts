import { CustomError } from './custom-error';

export class ConflictError extends CustomError {
  static status = 409;
  static code = 'conflict';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(ConflictError.status, ConflictError.code, messageOrParams, params);
  }
}
