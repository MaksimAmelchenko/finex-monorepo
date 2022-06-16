import { IRequestContext } from '../../../../types/app';
import { Session } from '../../model/session';

export async function getSession(ctx: IRequestContext, sessionId: string): Promise<Session | undefined> {
  return Session.query(ctx.trx).findById(sessionId);
}
