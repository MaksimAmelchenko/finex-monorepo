import { getRestApi } from '../../../libs/rest-api';

import { getEntities } from './get';

export const entitiesApiV1 = getRestApi([
  //
  getEntities,
]);
