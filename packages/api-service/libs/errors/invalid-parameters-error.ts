import { CustomError } from './custom-error';

export class InvalidParametersError extends CustomError {
  static status = 400;
  static code = 'invalidParameters';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(InvalidParametersError.status, InvalidParametersError.code, messageOrParams, params);
  }
}
