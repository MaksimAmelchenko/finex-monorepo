import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { SessionService } from '../../../../services/session';

export async function handler(
  ctx: IRequestContext<{ isEverywhere: boolean }, true>
): Promise<IResponse<Record<string, never>>> {
  const {
    params: { isEverywhere = false },
    sessionId,
  } = ctx;

  if (isEverywhere) {
    // await Session.closeAllUserSessions(ctx, userId);
  } else {
    if (sessionId) {
      await SessionService.closeSession(ctx, sessionId);
    }
  }

  return {
    body: {},
  };
}
