import { AccountService } from '../../../../services/account';
import { CreateAccountServiceData, IPublicAccount } from '../../../../services/account/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<CreateAccountServiceData>
): Promise<IResponse<{ account: IPublicAccount }>> {
  const { params } = ctx;
  const account = await AccountService.createAccount(ctx, params);

  return {
    body: {
      account,
    },
  };
}
