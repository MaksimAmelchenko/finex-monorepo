import { getRestApi } from '../../../libs/rest-api';

import { createUnit } from './create-unit';
import { deleteUnit } from './delete-unit';
import { getUnits } from './get-units';
import { updateUnit } from './update-unit';

export const unitApi = getRestApi([
  //
  createUnit,
  deleteUnit,
  getUnits,
  updateUnit,
]);
