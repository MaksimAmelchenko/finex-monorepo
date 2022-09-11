import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  CreateExchangeData,
  CreateExchangeResponse,
  GetExchangesQuery,
  GetExchangesResponse,
  IExchangesApi,
  UpdateExchangeChanges,
  UpdateExchangeResponse,
} from '../../types/exchange';

export class ExchangesApi extends ApiRepository implements IExchangesApi {
  static override storeName = 'ExchangesApi';

  getExchanges(query: GetExchangesQuery): Promise<GetExchangesResponse> {
    return this.fetch<GetExchangesResponse>({
      url: `/v2/exchanges?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
    });
  }

  createExchange(data: CreateExchangeData): Promise<CreateExchangeResponse> {
    return this.fetch<CreateExchangeResponse>({
      method: 'POST',
      url: '/v2/exchanges',
      body: data,
    });
  }

  updateExchange(exchangeId: string, changes: UpdateExchangeChanges): Promise<UpdateExchangeResponse> {
    return this.fetch<CreateExchangeResponse>({
      method: 'PATCH',
      url: `/v2/exchanges/${exchangeId}`,
      body: changes,
    });
  }

  deleteExchange(exchangeId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/exchanges/${exchangeId}`,
    });
  }
}
