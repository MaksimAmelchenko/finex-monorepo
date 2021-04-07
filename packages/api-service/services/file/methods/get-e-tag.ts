import * as crypto from 'crypto';
import { IFile } from '../../../types/file';

export default function getETag(file: IFile): string {
  return crypto
    .createHash('md5')
    .update(file.metadata!.updatedAt || file.metadata!.createdAt || file.name)
    .digest('hex');
}
