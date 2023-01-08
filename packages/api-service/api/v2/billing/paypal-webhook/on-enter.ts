import { IRequestContext, IRouterContext } from '../../../../types/app';

export async function onEnter(routerContext: IRouterContext, requestContext: IRequestContext): Promise<void> {
  const { headers, body } = routerContext.request;
  requestContext.additionalParams = {
    headers,
    body,
  };
}
