import { IRequestContext, IRouterContext } from '../../../../types/app';

export default async function onEnter(routerContext: IRouterContext, requestContext: IRequestContext): Promise<void> {
  const userAgent = routerContext.request.headers['user-agent'];
  const ip = routerContext.request.ip;
  requestContext.additionalParams = {
    userAgent,
    ip,
  };
}
