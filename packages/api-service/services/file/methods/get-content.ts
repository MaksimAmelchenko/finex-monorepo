import { IRequestContext } from '../../../types/app';
import { bucket } from '../../../types/file';
import { S3, S3Types } from '../../../libs/s3';

//  TODO simplify result
export default async function getContent(
  ctx: IRequestContext,
  projectId: number,
  fileId: number
): Promise<S3Types.Body | null | undefined> {
  try {
    return S3.get(ctx, bucket, `${projectId}/${fileId}`);
  } catch (e) {}

  return null;
}
