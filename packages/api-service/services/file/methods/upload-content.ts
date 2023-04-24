import { IRequestContext } from '../../../types/app';
import { bucket, TContent } from '../../../types/file';
// import { S3 } from '../../../libs/s3';

export default async function uploadContent(
  ctx: IRequestContext,
  projectId: number,
  fileId: number,
  content: TContent
): Promise<void> {
  // await S3.put(ctx, bucket, `${projectId}/${fileId}`, content);
}
