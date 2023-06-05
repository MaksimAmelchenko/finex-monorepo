import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ITagDTO } from '../../../../services/tag/types';
import { TagService } from '../../../../services/tag';
import { tagMapper } from '../../../../services/tag/tag.mapper';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse<{ tags: ITagDTO[] }>> {
  const { projectId } = ctx;
  const tags = await TagService.getTags(ctx, projectId);

  return {
    body: {
      tags: tags.map(tag => tagMapper.toDTO(tag)),
    },
  };
}
