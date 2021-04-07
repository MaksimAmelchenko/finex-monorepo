import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  static status = 404;
  static code = 'notFound';

  constructor();
  constructor(message: string);
  constructor(params: Record<string, unknown>);
  constructor(message: string, params: Record<string, unknown>);
  constructor(messageOrParams?: string | Record<string, unknown>, params?: Record<string, unknown>) {
    super(NotFoundError.status, NotFoundError.code, messageOrParams, params);
  }
}
