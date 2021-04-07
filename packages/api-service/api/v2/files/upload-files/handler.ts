import { IRequestContext } from '../../../../types/app';
import { IFile } from '../../../../types/file';
import { File } from '../../../../services/file';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { projectId } = ctx.params;
  const { files: uploadedFiles = [] } = ctx.params;

  const files: IFile[] = await Promise.all(
    uploadedFiles.map(({ name, contentType, content, size }) =>
      File.save(ctx, projectId, {
        name,
        contentType,
        content,
        size,
      })
    )
  );

  return {
    body: {
      files: files.map(File.decodeFile),
    },
  };
}
