import { getRestApi } from '../../../libs/rest-api';

import { deleteFileRouteOptions } from './delete-file';
import { getFileRouteOptions } from './get-file';
import { uploadFileRouteOptions } from './upload-files';

export const filesApi = getRestApi([
  //
  deleteFileRouteOptions,
  getFileRouteOptions,
  uploadFileRouteOptions,
]);
