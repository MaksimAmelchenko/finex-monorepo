import { AccountService } from '../../../../services/account';
import { IPublicAccount } from '../../../../services/account/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<{ accountId: string }, true>
): Promise<IResponse<{ account: IPublicAccount }>> {
  const {
    params: { accountId },
    projectId,
  } = ctx;
  const account = await AccountService.getAccount(ctx, projectId, accountId);

  return {
    body: {
      account: account.toPublicModel(),
    },
  };
}
