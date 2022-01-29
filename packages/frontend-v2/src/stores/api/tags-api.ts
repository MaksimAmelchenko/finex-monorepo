import { ApiRepository } from '../../core/other-stores/api-repository';
import { ITagsApi } from '../tags-repository';

export class TagsApi extends ApiRepository implements ITagsApi {
  static storeName = 'TagsApi';
}
