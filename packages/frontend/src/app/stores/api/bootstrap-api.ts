import { IBootstrapRaw } from '../../types/bootstrap';
import { ApiRepository } from '../../core/other-stores/api-repository';
import { IBootstrapApi } from '../bootstrap-store';

export class BootstrapApi extends ApiRepository implements IBootstrapApi {
  static override storeName = 'BootstrapApi';

  get(): Promise<IBootstrapRaw> {
    return this.fetch<IBootstrapRaw>({
      url: '/v2/entities',
    });
  }
}
