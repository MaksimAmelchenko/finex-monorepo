import { CustomError } from './custom-error';

export class GoneError extends CustomError {
  static status = 410;
  static code = 'gone';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(GoneError.status, GoneError.code, messageOrParams, params);
  }
}
