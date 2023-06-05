import { TagService } from '../../../../services/tag';
import { CreateTagServiceData, ITagDTO } from '../../../../services/tag/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { tagMapper } from '../../../../services/tag/tag.mapper';

export async function handler(ctx: IRequestContext<CreateTagServiceData, true>): Promise<IResponse<{ tag: ITagDTO }>> {
  const {
    params: { name },
    projectId,
    userId,
  } = ctx;
  const tag = await TagService.createTag(ctx, projectId, userId, { name });

  return {
    body: {
      tag: tagMapper.toDTO(tag),
    },
  };
}
