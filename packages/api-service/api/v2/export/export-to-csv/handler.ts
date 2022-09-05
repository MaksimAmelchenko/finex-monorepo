import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { Export } from '../../../../services/export';

export async function handler(ctx: IRequestContext<never, true>): Promise<IResponse<Record<any, never>>> {
  Export.toCsv(ctx).catch(err => ctx.log.fatal({ err }));

  return {
    body: {},
  };
}
