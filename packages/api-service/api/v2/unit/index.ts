import { getRestApi } from '../../../libs/rest-api';

import { createUnit } from './create-unit';
import { deleteUnit } from './delete-unit';
import { getUnits } from './get-contractors';
import { updateUnit } from './update-contractor';

export const unitApi = getRestApi([
  //
  createUnit,
  deleteUnit,
  getUnits,
  updateUnit,
]);
