import { IRequestContext } from '../../../../types/app';
import { INoContent } from '../../../../libs/rest-api/types';
import { Export } from '../../../../services/export';
import { StatusCodes } from 'http-status-codes';

export async function handler(ctx: IRequestContext<never, true>): Promise<INoContent> {
  await Export.toCsv(ctx);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
