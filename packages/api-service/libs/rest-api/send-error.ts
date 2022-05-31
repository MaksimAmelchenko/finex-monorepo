import send from './send';
import { IError, IRouterContext } from '../../types/app';
import config from '../config';

const isDevelopment = config.get('nodeEnv').startsWith('development');

export default function sendError(ctx: IRouterContext, error: any): void {
  const { status = 500, code, message = 'Error', stack, data, constraint } = error;

  const body = {
    error: {
      status,
      code: code || constraint || 'error',
      message,
      stack: isDevelopment ? stack : undefined,
      data,
    },
  };

  send(ctx, { body, status });
}
