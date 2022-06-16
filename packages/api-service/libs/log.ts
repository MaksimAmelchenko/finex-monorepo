import * as bunyan from 'bunyan';
import * as uuid from 'uuid';
import * as cloneDeep from 'lodash.clonedeep';
import config from '../libs/config';

import { ILogger, KoaContext, Middleware } from '../types/app';
import { IncomingMessage } from 'http';

const excludeFields: string[] = ['apiKey', 'token', 'password', 'authorization'];

const HTTP_X_REQUEST_ID_HEADER = 'X-Request-Id';

function maskValue(value: string): string {
  return `${value.substring(0, 1)}***${value.substring(value.length - 1)}`;
}

const serializers: bunyan.Serializers = {
  req: (req: IncomingMessage) => {
    if (!req || !req.socket) {
      return req;
    }
    const headers: Record<string, string> = cloneDeep(req.headers);

    excludeFields.forEach((field: string) => {
      if (headers[field]) {
        headers[field] = maskValue(headers[field]);
      }
    });

    return {
      method: req.method,
      url: req.url,
      headers,
      remoteAddress: req.socket.remoteAddress,
      remotePort: req.socket.remotePort,
    };
  },
  err: err => ({
    status: err.status || err.statusCode,
    code: err.code,
    name: err.name,
    message: err.message,
    data: err.data,
    stack: err.stack,
  }),
  res: res => {
    if (!res || !res.status) return res;
    return {
      statusCode: res.status,
      headers: res.headers,
    };
  },
  params: (obj: Record<string, unknown>) => {
    const params: Record<string, any> = cloneDeep(obj);
    excludeFields.forEach(field => {
      if (params[field]) {
        params[field] = maskValue(params[field]);
      }
    });
    return params;
  },
  authorization: (str: string) => maskValue(str),
};

const createLogger = (customFields: { [key: string]: any } = {}) =>
  bunyan.createLogger({
    name: `${config.get('appName')}-${config.get('env')}`,
    level: <bunyan.LogLevel>config.get('log:level'),
    version: config.get('version'),
    serializers,
    ...customFields,
  });

function logMiddleware(logger: ILogger): Middleware {
  return async (context: KoaContext, next: () => Promise<any>) => {
    const requestId = context.get(HTTP_X_REQUEST_ID_HEADER) || uuid.v4();
    context.requestId = requestId;
    context.set(HTTP_X_REQUEST_ID_HEADER, requestId);
    context.log = logger.child(
      {
        requestId,
      },
      true
    );
    return next();
  };
}

function requestLogMiddleware(): Middleware {
  return async (context: KoaContext, next: () => Promise<any>) => {
    const start: number = Date.now();
    context.log.info({ req: context.req });
    await next();
    const duration: number = Math.ceil(Date.now() - start);
    context.log.info({
      duration,
      res: context.response,
      req: { method: context.req.method, url: context.req.url, route: context['_matchedRoute'] },
    });
  };
}

const log = createLogger({});

export { logMiddleware, requestLogMiddleware, createLogger, log, bunyan, serializers };
