import { IRequestContext } from '../../../../types/app';
import { File } from '../../../../services/file';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse<Record<string, never>>> {
  const { projectId, fileId } = ctx.params;
  await File.remove(ctx, projectId, fileId);
  return {
    body: {},
  };
}
