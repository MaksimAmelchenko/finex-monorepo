import { StatusCodes } from 'http-status-codes';
import { FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } from 'pg-error-constants';

import config from '../config';
import send from './send';
import { IRouterContext } from '../../types/app';

const isDevelopment = config.get('nodeEnv').startsWith('development');

export default function sendError(ctx: IRouterContext, error: any): void {
  const { stack, data, nativeError } = error;
  let { status, code = 'error', message } = error;

  if (nativeError) {
    // hide inner details
    message = '';
    switch (nativeError.code) {
      case UNIQUE_VIOLATION: {
        status = StatusCodes.CONFLICT;
        code = nativeError.constraint;
        break;
      }
      case FOREIGN_KEY_VIOLATION: {
        status = StatusCodes.BAD_REQUEST;
        code = nativeError.constraint;
        break;
      }
      default:
        status = 500;
        code = nativeError.code;
    }
  }

  const body = {
    error: {
      status,
      code,
      message,
      stack: isDevelopment ? stack : undefined,
      data,
    },
  };

  send(ctx, { body, status });
}
