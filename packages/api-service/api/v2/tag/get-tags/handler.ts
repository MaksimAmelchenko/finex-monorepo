import { TagService } from '../../../../services/tag';
import { IPublicTag } from '../../../../services/tag/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse<{ tags: IPublicTag[] }>> {
  const { projectId } = ctx;
  const tags = await TagService.getTags(ctx, projectId);

  return {
    body: {
      tags: tags.map(tag => tag.toPublicModel()),
    },
  };
}
