import { IRouterContext } from '../../types/app';
import config from '../config';

type Params = Record<string, any> & { locale: Locale };

const locales: Locale[] = config.get('locales');

export async function getParams(ctx: IRouterContext): Promise<Params> {
  const params: Params = { ...(ctx.request.body || {}), ...(ctx.query || {}), ...(ctx.params || {}) };

  if (!params.locale || !locales.includes(params.locale)) {
    params.locale = locales[0];
  }

  ctx.log.trace({ params });
  return params;
}
