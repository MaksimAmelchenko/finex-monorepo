import { TagService } from '../../../../services/tag';
import { IPublicTag, UpdateTagServiceChanges } from '../../../../services/tag/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<UpdateTagServiceChanges & { tagId: string }>
): Promise<IResponse<{ tag: IPublicTag }>> {
  const {
    projectId,
    params: { tagId, ...changes },
  } = ctx;

  const tag = await TagService.updateTag(ctx, projectId, tagId, changes);

  return {
    body: {
      tag: tag.toPublicModel(),
    },
  };
}
