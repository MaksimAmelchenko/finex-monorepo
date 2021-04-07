import { createHousehold } from './methods/create-household';
import { getHousehold } from './methods/get-household';

// tslint:disable-next-line:variable-name
export const Household = {
  create: createHousehold,
  get: getHousehold,
};
