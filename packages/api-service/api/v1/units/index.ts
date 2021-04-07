import { getRestApi } from '../../../libs/rest-api';

import { createUnit } from './create-unit';
import { deleteUnit } from './delete-unit';
import { getUnits } from './get-units';
import { getUnit } from './get-unit';
import { updateUnit } from './update-unit';

export const unitsApi = getRestApi([
  //
  createUnit,
  deleteUnit,
  getUnits,
  getUnit,
  updateUnit,
]);
