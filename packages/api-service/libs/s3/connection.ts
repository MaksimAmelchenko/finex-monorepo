import { AWS } from '../aws';

const s3: AWS.S3 = new AWS.S3();

export import S3Types = AWS.S3.Types; // tslint:disable-line:import-name
export { s3 };
