import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';

import { GetOperationsQuery, GetOperationsResponse, IOperationsApi } from '../../types/operation';

export class OperationsApi extends ApiRepository implements IOperationsApi {
  static override storeName = 'OperationsApi';

  get(query: GetOperationsQuery): Promise<GetOperationsResponse> {
    return this.fetch<GetOperationsResponse>({
      url: `/v1/operations?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
    });
  }
}
