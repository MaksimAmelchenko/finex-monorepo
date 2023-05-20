import { IRequestContext, IRouterContext } from '../../../../types/app';

export async function onEnter(routerContext: IRouterContext, requestContext: IRequestContext): Promise<void> {
  const {
    ip,
    headers: { origin },
  } = routerContext;
  requestContext.additionalParams = {
    origin,
    ip,
  };
}
