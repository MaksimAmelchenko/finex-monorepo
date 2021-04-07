import { getRestApi } from '../../../libs/rest-api';

import { createIe } from './create-ie';
import { deleteIe } from './delete-ie';
import { getIes } from './get-ies';
import { getIe } from './get-ie';
import { updateIe } from './update-ie';

export const iesApi = getRestApi([
  //
  createIe,
  deleteIe,
  getIes,
  getIe,
  updateIe,
]);
