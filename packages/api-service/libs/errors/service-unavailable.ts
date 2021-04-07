import { CustomError } from './custom-error';

export class ServiceUnavailableError extends CustomError {
  static status = 503;
  static code = 'serviceUnavailable';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(ServiceUnavailableError.status, ServiceUnavailableError.code, messageOrParams, params);
  }
}
