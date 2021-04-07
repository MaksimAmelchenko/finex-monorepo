import * as moment from 'moment';

import { IRequestContext } from '../../../types/app';
import { ISession } from '../../../types/session';
import { SessionGateway } from '../gateway';

export async function updateSessionAccessTime(ctx: IRequestContext, sessionId: string): Promise<ISession> {
  const session: ISession = await SessionGateway.update(ctx, sessionId, {
    last_access_time: moment.utc().format(),
  });

  return session;
}
