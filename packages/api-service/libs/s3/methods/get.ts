import { IRequestContext } from '../../../types/app';
import { s3, S3Types } from '../connection';

export default async function get(
  ctx: IRequestContext,
  bucket: string,
  key: string
): Promise<S3Types.Body | undefined> {
  try {
    const start: number = Date.now();
    const params: S3Types.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    const response: S3Types.GetObjectOutput = await s3.getObject(params).promise();
    const duration: number = Math.ceil(Date.now() - start);
    ctx.log.trace({ duration, s3: { type: 'get', bucket, key } });
    return response.Body;
  } catch (err) {
    ctx.log.error({ s3: { type: 'get', bucket, key }, err });
    throw err;
  }
}
