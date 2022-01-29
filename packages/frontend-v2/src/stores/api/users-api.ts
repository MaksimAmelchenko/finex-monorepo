import { ApiRepository } from '../../core/other-stores/api-repository';
import { IUsersApi } from '../users-repository';

export class UsersApi extends ApiRepository implements IUsersApi {
  static storeName = 'UsersApi';
}
