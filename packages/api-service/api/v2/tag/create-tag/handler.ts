import { TagService } from '../../../../services/tag';
import { CreateTagServiceData, IPublicTag } from '../../../../services/tag/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<CreateTagServiceData, true>
): Promise<IResponse<{ tag: IPublicTag }>> {
  const {
    params: { name },
    projectId,
    userId,
  } = ctx;
  const tag = await TagService.createTag(ctx, projectId, userId, { name });

  return {
    body: {
      tag: tag.toPublicModel(),
    },
  };
}
