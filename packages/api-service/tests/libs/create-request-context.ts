import * as uuid from 'uuid';
import { Knex } from 'knex';

import { log } from '../../libs/log';
import { IRequestContext } from '../../types/app';

export async function createRequestContext(
  trx?: Knex.Transaction,
  requestId: string = uuid.v4()
): Promise<IRequestContext<never, false>> {
  return {
    params: {} as never,
    cookies: {} as any,
    log: log.child(
      {
        requestId,
      },
      true
    ),
    requestId,
    trx,
  };
}
