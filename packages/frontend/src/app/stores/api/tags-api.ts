import { ApiRepository } from '../../core/other-stores/api-repository';
import { ITagsApi } from '../tags-repository';
import {
  CreateTagData,
  CreateTagResponse,
  GetTagsResponse,
  UpdateTagChanges,
  UpdateTagResponse,
} from '../../types/tag';

export class TagsApi extends ApiRepository implements ITagsApi {
  static override storeName = 'TagsApi';

  getTags(): Promise<GetTagsResponse> {
    return this.fetch<GetTagsResponse>({
      method: 'GET',
      url: '/v2/tags',
    });
  }

  createTag(data: CreateTagData): Promise<CreateTagResponse> {
    return this.fetch<CreateTagResponse>({
      method: 'POST',
      url: '/v2/tags',
      body: data,
    });
  }

  updateTag(tagId: string, changes: UpdateTagChanges): Promise<UpdateTagResponse> {
    return this.fetch<CreateTagResponse>({
      method: 'PATCH',
      url: `/v2/tags/${tagId}`,
      body: changes,
    });
  }

  deleteTag(tagId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/tags/${tagId}`,
    });
  }
}
