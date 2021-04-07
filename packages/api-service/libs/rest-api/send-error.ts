import send from './send';
import { IError, IRouterContext } from '../../types/app';
import config from '../config';

const isDevelopment = config.get('nodeEnv').startsWith('development');

export default function sendError(ctx: IRouterContext, error: IError): void {
  const { status = 500, code = 'error', message = 'Error', stack, data } = error;

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
