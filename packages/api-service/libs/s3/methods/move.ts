import { IRequestContext } from '../../../types/app';
import { s3, S3Types } from '../connection';

export default async function put(ctx: IRequestContext, bucket: string, from: string, to: string): Promise<void> {
  try {
    const start: number = Date.now();
    const copyParams: S3Types.CopyObjectRequest = {
      Bucket: bucket,
      CopySource: `${bucket}/${from}`,
      Key: to,
    };
    await s3.copyObject(copyParams).promise();

    const deleteParams: S3Types.DeleteObjectRequest = {
      Bucket: bucket,
      Key: from,
    };
    await s3.deleteObject(deleteParams).promise();

    const duration: number = Math.ceil(Date.now() - start);
    ctx.log.trace({ duration, s3: { type: 'move', bucket, from, to } });
  } catch (err) {
    ctx.log.error({ s3: { type: 'move', bucket, from, to }, err });
    throw err;
  }
}
