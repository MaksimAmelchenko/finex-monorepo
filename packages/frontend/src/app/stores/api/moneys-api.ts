import { ApiRepository } from '../../core/other-stores/api-repository';
import { IMoneysApi } from '../moneys-repository';
import {
  CreateMoneyData,
  CreateMoneyResponse,
  GetMoneysResponse,
  UpdateMoneyChanges,
  UpdateMoneyResponse,
} from '../../types/money';

export class MoneysApi extends ApiRepository implements IMoneysApi {
  static override storeName = 'MoneysApi';

  getMoneys(): Promise<GetMoneysResponse> {
    return this.fetch<GetMoneysResponse>({
      method: 'GET',
      url: '/v2/moneys',
    });
  }

  createMoney(data: CreateMoneyData): Promise<CreateMoneyResponse> {
    return this.fetch<CreateMoneyResponse>({
      method: 'POST',
      url: '/v2/moneys',
      body: data,
    });
  }

  updateMoney(moneyId: string, changes: UpdateMoneyChanges): Promise<UpdateMoneyResponse> {
    return this.fetch<CreateMoneyResponse>({
      method: 'PATCH',
      url: `/v2/moneys/${moneyId}`,
      body: changes,
    });
  }

  deleteMoney(moneyId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/moneys/${moneyId}`,
    });
  }

  sortMoneys(moneyIds: string[]): Promise<void> {
    return this.fetch<void>({
      method: 'PUT',
      url: `/v2/moneys/sort`,
      body: {
        moneyIds,
      },
    });
  }
}
