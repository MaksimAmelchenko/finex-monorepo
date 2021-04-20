import { createHousehold } from './methods/create-household';
import { getHousehold } from './methods/get-household';

export const Household = {
  create: createHousehold,
  get: getHousehold,
};
