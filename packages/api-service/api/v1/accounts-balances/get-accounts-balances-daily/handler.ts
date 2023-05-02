import { IAccountDailyBalance } from '../../../../modules/account/types';
import { IRequestContext, TDate } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { accountService } from '../../../../modules/account/account.service';

interface Params {
  startDate: TDate;
  endDate: TDate;
  moneyId?: string | null;
}

interface Body {
  accountDailyBalances: IAccountDailyBalance[];
}

export async function handler(ctx: IRequestContext<Params, true>): Promise<IResponse<Body>> {
  const {
    projectId,
    userId,
    params: { startDate, endDate, moneyId = null },
  } = ctx;

  const accountDailyBalances = await accountService.getDailyBalances(ctx, projectId, userId, {
    startDate,
    endDate,
    moneyId,
  });

  return {
    body: {
      accountDailyBalances,
    },
  };
}
