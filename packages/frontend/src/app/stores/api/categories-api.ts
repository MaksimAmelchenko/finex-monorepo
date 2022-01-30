import { ApiRepository } from '../../core/other-stores/api-repository';
import { ICategoriesApi } from '../categories-repository';

export class CategoriesApi extends ApiRepository implements ICategoriesApi {
  static override storeName = 'CategoriesApi';
}
