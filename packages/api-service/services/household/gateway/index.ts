import { createHousehold } from './methods/create-household';
import { getHousehold } from './methods/get-household';

export const HouseholdGateway = {
  create: createHousehold,
  get: getHousehold,
};
