import { S3Types, s3 } from './connection';
import get from './methods/get';
import move from './methods/move';
import put from './methods/put';
import remove from './methods/remove';

// tslint:disable-next-line:variable-name
const S3 = {
  get,
  move,
  put,
  remove,
};

export { S3, S3Types, s3 };
