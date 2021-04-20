import { AWS } from '../aws';

const s3: AWS.S3 = new AWS.S3();

export import S3Types = AWS.S3.Types;

export { s3 };
