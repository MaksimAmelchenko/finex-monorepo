import { ApiRepository } from '../../core/other-stores/api-repository';
import { IUnitsApi } from '../units-repository';

export class UnitsApi extends ApiRepository implements IUnitsApi {
  static override storeName = 'UnitsApi';
}
