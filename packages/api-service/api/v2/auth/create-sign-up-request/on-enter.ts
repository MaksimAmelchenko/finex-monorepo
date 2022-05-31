import { IRequestContext, IRouterContext } from '../../../../types/app';

export async function onEnter(routerContext: IRouterContext, requestContext: IRequestContext): Promise<void> {
  const ip = routerContext.request.ip;
  requestContext.additionalParams = {
    ip,
  };
}
