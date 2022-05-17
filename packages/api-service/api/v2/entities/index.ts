import { getRestApi } from '../../../libs/rest-api';

import { getEntities } from './get';

export const entitiesApi = getRestApi([
  //
  getEntities,
]);
