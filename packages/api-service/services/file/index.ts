import create from './methods/create';
import decodeFile from './methods/decode-file';
import get from './methods/get';
import getContent from './methods/get-content';
import getETag from './methods/get-e-tag';
import remove from './methods/remove';
import save from './methods/save';
import uploadContent from './methods/upload-content';

// tslint:disable-next-line:variable-name
const File = {
  create,
  decodeFile,
  get,
  getContent,
  getETag,
  remove,
  save,
  uploadContent,
};

export { File };
