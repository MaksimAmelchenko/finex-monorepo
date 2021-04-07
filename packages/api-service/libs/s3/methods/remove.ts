import { IRequestContext } from '../../../types/app';
import { s3, S3Types } from '../connection';

export default async function remove(ctx: IRequestContext, bucket: string, key: string): Promise<void> {
  try {
    const start: number = Date.now();
    const params: S3Types.DeleteObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    await s3.deleteObject(params).promise();
    const duration: number = Math.ceil(Date.now() - start);
    ctx.log.trace({ duration, s3: { type: 'delete', bucket, key } });
  } catch (err) {
    ctx.log.error({ s3: { type: 'delete', bucket, key }, err });
    throw err;
  }
}
