import { stringify } from 'query-string';
import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  IGetBalanceParams,
  IGetBalanceResponse,
  IGetDailyBalanceParams,
  IGetDailyBalanceResponse,
} from '../../types/balance';
import { IBalanceApi } from '../balance-repository';

export class BalanceApi extends ApiRepository implements IBalanceApi {
  static override storeName = 'DashboardApi';

  getBalance(params: IGetBalanceParams): Promise<IGetBalanceResponse> {
    const { dBalance, moneyId } = params;
    const queryString = stringify(
      {
        dBalance,
        idMoney: moneyId,
      },
      { skipNull: true }
    );
    return this.fetch<IGetBalanceResponse>({
      url: `/v1/dashboard/balances?${queryString}`,
    });
  }

  getDailyBalance(params: IGetDailyBalanceParams): Promise<IGetDailyBalanceResponse> {
    const { dBegin, dEnd, moneyId } = params;
    const queryString = stringify(
      {
        dBegin,
        dEnd,
        idMoney: moneyId,
      },
      { skipNull: true }
    );

    return this.fetch<IGetDailyBalanceResponse>({
      url: `/v1/accounts/balances/daily?${queryString}`,
    });
  }
}
