import { StatusCodes } from 'http-status-codes';

import { TagService } from '../../../../services/tag';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';

export async function handler(ctx: IRequestContext<{ tagId: string }>): Promise<INoContent> {
  const {
    projectId,
    params: { tagId },
  } = ctx;
  await TagService.deleteTag(ctx, projectId, tagId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
