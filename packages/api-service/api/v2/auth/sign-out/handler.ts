import { IRequestContext } from '../../../../types/app';
import { Session } from '../../../../services/session';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse<Record<string, never>>> {
  const {
    params: { isEverywhere = false },
    sessionId,
  } = ctx;

  if (isEverywhere) {
    // await Session.closeAllUserSessions(ctx, userId);
  } else {
    if (sessionId) {
      await Session.closeSession(ctx, sessionId);
    }
  }

  return {
    body: {},
  };
}
