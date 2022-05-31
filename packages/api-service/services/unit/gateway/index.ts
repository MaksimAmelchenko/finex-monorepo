import { createUnit } from './methods/create-unit';
import { deleteUnit } from './methods/delete-unit';
import { getUnits } from './methods/get-units';
import { updateUnit } from './methods/update-unit';

export const UnitGateway = {
  createUnit,
  deleteUnit,
  getUnits,
  updateUnit,
};
