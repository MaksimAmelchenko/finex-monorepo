import { ApiRepository } from '../../core/other-stores/api-repository';
import { IProfileApi } from '../profile-repository';

export class ProfileApi extends ApiRepository implements IProfileApi {
  static storeName = 'ProfileApi';
}
