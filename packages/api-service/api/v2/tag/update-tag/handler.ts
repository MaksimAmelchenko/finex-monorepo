import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ITagDTO, UpdateTagServiceChanges } from '../../../../services/tag/types';
import { TagService } from '../../../../services/tag';
import { tagMapper } from '../../../../services/tag/tag.mapper';

export async function handler(
  ctx: IRequestContext<UpdateTagServiceChanges & { tagId: string }, true>
): Promise<IResponse<{ tag: ITagDTO }>> {
  const {
    projectId,
    params: { tagId, name },
  } = ctx;

  const tag = await TagService.updateTag(ctx, projectId, tagId, { name });

  return {
    body: {
      tag: tagMapper.toDTO(tag),
    },
  };
}
