import { IRouterContext } from '../../types/app';

type Params = Record<string, any>;

export async function getParams(ctx: IRouterContext): Promise<Params> {
  const params: Params = { ...(ctx.request['body'] || {}), ...(ctx.query || {}), ...(ctx.params || {}) };
  ctx.log.trace({ params });
  return params;
}
