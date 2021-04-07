import { getRestApi } from '../../../libs/rest-api';

import { createIeDetail } from './create-ie-detail';
import { deleteIeDetail } from './delete-ie-detail';
import { getIeDetails } from './get-ie-details';
import { getIeDetail } from './get-ie-detail';
import { updateIeDetail } from './update-ie-detail';

export const ieDetailsApi = getRestApi([
  //
  createIeDetail,
  deleteIeDetail,
  getIeDetails,
  getIeDetail,
  updateIeDetail,
]);
