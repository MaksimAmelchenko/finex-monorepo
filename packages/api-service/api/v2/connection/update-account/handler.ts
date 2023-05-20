import { IAccountDTO } from '../../../../modules/connection/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { connectionMapper } from '../../../../modules/connection/connection.mapper';
import { connectionService } from '../../../../modules/connection/connection.service';

interface IParams {
  connectionAccountId: string;
  accountId?: string | null;
  syncFrom?: string | null;
}

export async function handler(ctx: IRequestContext<IParams, true>): Promise<IResponse<{ account: IAccountDTO }>> {
  const {
    projectId,
    userId,
    params: { connectionAccountId, accountId, syncFrom },
  } = ctx;
  const account = await connectionService.updateAccount(ctx, projectId, userId, connectionAccountId, {
    accountId,
    syncFrom,
  });

  return {
    body: {
      account: connectionMapper.toAccountDTO(account),
    },
  };
}
