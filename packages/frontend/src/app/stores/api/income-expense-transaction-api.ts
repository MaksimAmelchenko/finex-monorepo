import { ApiRepository } from '../../core/other-stores/api-repository';
import { IIncomeExpenseTransactionsApi } from '../income-expense-transactions-repository';
import {
  IGetIncomeExpenseTransactionsParams,
  IGetIncomeExpenseTransactionsResponse,
} from '../../types/income-expense-transaction';

export class IncomeExpenseTransactionsApi extends ApiRepository implements IIncomeExpenseTransactionsApi {
  static override storeName = 'IncomeExpenseTransactionsApi';

  get(params: IGetIncomeExpenseTransactionsParams): Promise<IGetIncomeExpenseTransactionsResponse> {
    return this.fetch<IGetIncomeExpenseTransactionsResponse>({
      url: '/v1/cashflows/ie_details',
    });
  }
}
