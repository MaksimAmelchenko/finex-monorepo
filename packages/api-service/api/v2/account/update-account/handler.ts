import { AccountService } from '../../../../services/account';
import { IPublicAccount, UpdateAccountServiceChanges } from '../../../../services/account/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<UpdateAccountServiceChanges & { accountId: string }>
): Promise<IResponse<{ account: IPublicAccount }>> {
  const {
    projectId,
    params: { accountId, ...changes },
  } = ctx;
  const account = await AccountService.updateAccount(ctx, projectId, accountId, changes);

  return {
    body: {
      account: account.toPublicModel(),
    },
  };
}
