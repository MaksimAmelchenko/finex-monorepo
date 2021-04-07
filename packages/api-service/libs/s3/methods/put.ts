import { IRequestContext } from '../../../types/app';
import { s3, S3Types } from '../connection';

export default async function put(
  ctx: IRequestContext,
  bucket: string,
  key: string,
  body: S3Types.Body
): Promise<S3Types.Body | undefined> {
  try {
    const start: number = Date.now();
    const params: S3Types.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: body,
    };
    const response: S3Types.GetObjectOutput = await s3.putObject(params).promise();
    const duration: number = Math.ceil(Date.now() - start);
    ctx.log.trace({ duration, s3: { type: 'put', bucket, key } });
    return response.Body;
  } catch (err) {
    ctx.log.error({ s3: { type: 'put', bucket, key }, err });
    throw err;
  }
}
