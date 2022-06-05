import { IRequestContext } from '../types/app';
import * as uuid from 'uuid';
import { log } from './log';

export default function createRequestContext(requestId: string = uuid.v4()): IRequestContext<never, false> {
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
    trx: {} as any,
  };
}
