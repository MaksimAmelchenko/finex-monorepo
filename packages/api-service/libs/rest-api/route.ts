import * as defaults from 'lodash.defaults';

import { ajv } from '../ajv';
import send, { isContent } from './send';
import sendError from './send-error';
import getValidators from './get-validators';
import getParams from './get-params';
import getMultipartParams from './get-multipart-params';
import { authorize } from './authorize';
import { InvalidParametersError, InvalidResponseError } from '../errors';
import { log } from '../log';

import { IRequestContext, IRouterContext } from '../../types/app';
import { IResponse, IRestRoute, RestMethod, RestRouteOptions, SchemasValidators } from './types';

export class RestRoute implements IRestRoute {
  options: RestRouteOptions;
  validators: SchemasValidators;
  getParams: (routerContext: IRouterContext) => Promise<Record<string, unknown>>;

  constructor(routeOptions: RestRouteOptions) {
    this.options = defaults(routeOptions, {
      method: RestMethod.Get,
      isNeedAuthorization: true,
      isUpdateSessionAccessTime: true,
    });

    try {
      this.validators = getValidators(this.options.schemas);
    } catch (err) {
      log.fatal(
        { method: this.options.method || this.options.methods, uri: this.options.uri, err },
        'Initial validators error'
      );
      throw err;
    }

    this.getParams = routeOptions.uploader ? getMultipartParams(routeOptions.uploader) : getParams;
  }

  async handler(routerContext: IRouterContext): Promise<void> {
    const { options } = this;
    try {
      const {
        headers: { 'user-agent': userAgent },
      } = routerContext.request;

      const ctx: IRequestContext = {
        params: {},
        log: routerContext.log,
        requestId: routerContext.requestId,
        cookies: routerContext.cookies,
        userAgent,
      };

      if (options.isNeedAuthorization) {
        const { url } = routerContext;
        const authorization: string | undefined = routerContext.headers['authorization'];
        await authorize(ctx, authorization, url);
        ctx.authorization = authorization;
        // in authorize a logger has been extended (added sessionId, userId/serviceId)
        routerContext.log = ctx.log;
      }

      let params = {};
      try {
        params = await this.getParams(routerContext);
      } catch (err) {
        throw new InvalidParametersError(err.message);
      }

      if (!this.validators.params(params)) {
        throw new InvalidParametersError('Parameters validation error', {
          moreInfo: ajv.errorsText(this.validators.params.errors, { dataVar: 'parameters' }),
          errors: this.validators.params.errors,
        });
      }
      ctx.params = params;

      if (options.onEnter) {
        await options.onEnter(routerContext, ctx);
      }

      // const payload = await routeHandler(ctx);
      const response: IResponse = await options.handler(ctx);

      if (isContent(response)) {
        if (!this.validators.response(JSON.parse(JSON.stringify(response.body)))) {
          const err: InvalidResponseError = new InvalidResponseError('Response validation error', {
            moreInfo: ajv.errorsText(this.validators.response.errors, { dataVar: 'fields' }),
            errors: this.validators.response.errors,
            data: {
              method: routerContext.req.method,
              route: routerContext['_matchedRoute'],
            },
          });
          ctx.log.fatal({ err });
        }
      }

      send(routerContext, response);
    } catch (err) {
      routerContext.log.error({ err });
      sendError(routerContext, err);
    }
  }
}

// export default function constructRestRoute(routeOptions: RestRouteOptions): RestRoute {
//   return new RestRoute(routeOptions);
// }
