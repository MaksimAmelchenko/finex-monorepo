import { IAccountBalances } from '../../../../modules/account/types';
import { IDebtBalances } from '../../../../modules/debt/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { accountService } from '../../../../modules/account/account.service';
import { debtService } from '../../../../modules/debt/debt.service';

interface Params {
  balanceDate: string;
  moneyId?: string | null;
}

interface Body {
  accountsBalances: IAccountBalances[];
  debtsBalances: IDebtBalances[];
}

export async function handler(ctx: IRequestContext<Params, true>): Promise<IResponse<Body>> {
  const {
    projectId,
    userId,
    params: { balanceDate, moneyId = null },
  } = ctx;

  const [accountsBalances, debtsBalances] = await Promise.all([
    accountService.getBalances(ctx, projectId, userId, {
      balanceDate,
      moneyId,
    }),
    debtService.getBalances(ctx, projectId, userId, {
      balanceDate,
      moneyId,
    }),
  ]);

  return {
    body: {
      accountsBalances,
      debtsBalances,
    },
  };
}
