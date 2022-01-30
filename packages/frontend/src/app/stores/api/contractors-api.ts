import { ApiRepository } from '../../core/other-stores/api-repository';
import { IContractorsApi } from '../contractors-repository';

export class ContractorsApi extends ApiRepository implements IContractorsApi {
  static override storeName = 'ContractorsApi';
}
