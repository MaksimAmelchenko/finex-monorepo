import { getRestApi } from '../../../libs/rest-api';

import { findOperations } from './find-operations';

export const operationApi = getRestApi([
  //
  findOperations,
]);
