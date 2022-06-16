import { AccountService } from '../../../../services/account';
import { CreateAccountServiceData, IPublicAccount } from '../../../../services/account/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<CreateAccountServiceData>
): Promise<IResponse<{ account: IPublicAccount }>> {
  const { params, userId, projectId } = ctx;
  const account = await AccountService.createAccount(ctx, projectId, userId, params);

  return {
    body: {
      account: account.toPublicModel(),
    },
  };
}
