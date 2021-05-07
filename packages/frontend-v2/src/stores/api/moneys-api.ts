import { ApiRepository } from '../../core/other-stores/api-repository';
import { IMoneysApi } from '../moneys-repository';

export class MoneysApi extends ApiRepository implements IMoneysApi {
  static storeName = 'MoneysApi';
}
