import { ApiRepository } from '../../core/other-stores/api-repository';

import { GetCurrenciesResponse, ICurrenciesApi } from '../../types/currency';

export class CurrenciesApi extends ApiRepository implements ICurrenciesApi {
  static override storeName = 'CurrenciesApi';

  getCurrencies(): Promise<GetCurrenciesResponse> {
    return this.fetch<GetCurrenciesResponse>({
      method: 'GET',
      url: '/v1/currencies',
    });
  }
}
