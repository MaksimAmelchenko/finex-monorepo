import { ApiRepository } from '../../core/other-stores/api-repository';
import { IApiBootstrap } from '../../types/bootstrap';
import { IBootstrapApi } from '../bootstrap-store';

export class BootstrapApi extends ApiRepository implements IBootstrapApi {
  static override storeName = 'BootstrapApi';

  get(): Promise<IApiBootstrap> {
    return this.fetch<IApiBootstrap>({
      url: '/v2/entities',
    });
  }
}
