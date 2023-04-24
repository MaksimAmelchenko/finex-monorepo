import { IRequestContext } from '../../../types/app';
import { bucket } from '../../../types/file';
// import { S3 } from '../../../libs/s3';

export default async function removeContent(ctx: IRequestContext, projectId: number, fileId: number): Promise<void> {
  try {
    // S3.remove(ctx, bucket, `${projectId}/${fileId}`).catch(err => {
    //   ctx.log.warn({ err });
    // });
  } catch (e) {}
}
