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
    const { balanceDate, moneyId } = params;
    const queryString = stringify(
      {
        balanceDate,
        moneyId,
      },
      { skipNull: true }
    );
    return this.fetch<IGetBalanceResponse>({
      url: `/v1/dashboard/balances?${queryString}`,
    });
  }

  getDailyBalance(params: IGetDailyBalanceParams): Promise<IGetDailyBalanceResponse> {
    const { startDate, endDate, moneyId } = params;
    const queryString = stringify(
      {
        startDate,
        endDate,
        moneyId,
      },
      { skipNull: true }
    );

    return this.fetch<IGetDailyBalanceResponse>({
      url: `/v1/accounts/balances/daily?${queryString}`,
    });
  }
}
