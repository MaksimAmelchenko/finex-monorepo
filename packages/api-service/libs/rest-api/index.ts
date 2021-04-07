import * as Router from 'koa-router';
// import Router from 'koa-trie-router';
import { RestRouteOptions } from './types';
import { RestRoute } from './route';
import { IRouterContext } from '../../types/app';

function restRouteHandler(route: RestRoute) {
  return async (ctx: IRouterContext) => {
    // try {
    //   await route.checkAccess(ctx);
    // } catch (error) {
    //   return sendError(ctx, { code: 403, error });
    // }

    return route.handler(ctx);
  };
}

export function getRestApi(restRouteOptions: RestRouteOptions[]): Router.IMiddleware {
  const restRouter: Router = restRouteOptions.reduce((router: Router, routeOptions: RestRouteOptions) => {
    const routeUri: string = routeOptions.uri.startsWith('/') ? routeOptions.uri : `/${routeOptions.uri}`;
    const { method, methods } = routeOptions;
    const handler = restRouteHandler(new RestRoute(routeOptions));

    if (method) {
      router[method.toLowerCase()](routeUri, handler);
    } else {
      methods!.forEach(m => router[m.toLowerCase()](routeUri, handler));
    }
    return router;
  }, new Router());

  return restRouter.routes();
}
