import * as defaults from 'lodash.defaults';

import config from '../config';
import { IRequestContext, IRouterContext, Locale } from '../../types/app';
import { IResponse, IRestRoute, RestMethod, RestRouteOptions, SchemasValidators } from './types';
import { InvalidParametersError, InvalidResponseError, UnauthorizedError } from '../errors';
import { ajv } from '../ajv';
import { authorize } from './authorize';
import { getMultipartParams } from './get-multipart-params';
import { getParams } from './get-params';
import { getValidators } from './get-validators';
import { knex } from '../../knex';
import { log } from '../log';
import { send, isContent } from './send';
import { sendError } from './send-error';

const locales: Locale[] = config.get('locales');

export class RestRoute<P extends unknown, IsAuthorized extends boolean> implements IRestRoute {
  options: RestRouteOptions<P, IsAuthorized>;
  validators: SchemasValidators;
  getParams: (routerContext: IRouterContext) => Promise<Record<string, unknown> & { locale: Locale }>;

  constructor(routeOptions: RestRouteOptions<P, IsAuthorized>) {
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

    this.getParams = routeOptions.uploader ? (getMultipartParams(routeOptions.uploader) as any) : getParams;
  }

  async handler(routerContext: IRouterContext, next): Promise<any> {
    const { options } = this;

    const ctx: IRequestContext = {
      params: { locale: locales[0] },
      log: routerContext.log,
      requestId: routerContext.requestId,
      cookies: routerContext.cookies,
    };
    // Using trx as a transaction object:
    ctx.trx = await knex.transaction();

    try {
      if (options.isNeedAuthorization) {
        const { url } = routerContext;
        const authorizationHeader = routerContext.headers['authorization'];
        if (!authorizationHeader) {
          throw new UnauthorizedError('Authorization header not present');
        }

        await authorize(ctx as IRequestContext<unknown, true>, authorizationHeader, url);
        // in authorize a logger has been extended (added sessionId, userId/serviceId)
        routerContext.log = ctx.log;
        await knex
          .raw('select context.set(?)', [(ctx as IRequestContext<unknown, true>).sessionId])
          .transacting(ctx.trx);
      }

      let params = { locale: locales[0] };
      try {
        params = await this.getParams(routerContext);
      } catch (err: any) {
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
        await options.onEnter(routerContext, ctx as any);
      }

      const response: IResponse = await options.handler(ctx as any, routerContext, next);
      // a logger may been extended into handler
      routerContext.log = ctx.log;

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
      await ctx.trx.commit();
      send(routerContext, response);
    } catch (err: any) {
      await ctx.trx.rollback();
      routerContext.log.error({ err });
      sendError(routerContext, err);
    }
  }
}

// export default function constructRestRoute(routeOptions: RestRouteOptions): RestRoute {
//   return new RestRoute(routeOptions);
// }
