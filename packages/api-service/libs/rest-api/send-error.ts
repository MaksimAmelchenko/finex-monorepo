import { StatusCodes } from 'http-status-codes';
import { FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } from 'pg-error-constants';
import { DBError, ValidationError } from 'objection';

import config from '../config';
import { send } from './send';
import { IRouterContext } from '../../types/app';

const isDevelopment = config.get('nodeEnv').startsWith('development');

export function sendError(ctx: IRouterContext, error: any): void {
  if (error instanceof ValidationError) {
    let { message, stack, statusCode: status, data } = error;
    const body = {
      error: {
        code: 'modelValidation',
        message,
        stack: isDevelopment ? stack : undefined,
      },
    };

    send(ctx, { body, status });
    return;
  }

  if (error instanceof DBError) {
    const { stack, nativeError } = error as any;
    let status: number;
    let code: string;
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

    const body = {
      error: {
        code,
        message: 'Database error',
        stack: isDevelopment ? stack : undefined,
      },
    };

    send(ctx, { body, status });
    return;
  }

  let { message, stack, status, code } = error;

  const body = {
    error: {
      code,
      message,
      stack: isDevelopment ? stack : undefined,
    },
  };
  send(ctx, { body, status });
}
