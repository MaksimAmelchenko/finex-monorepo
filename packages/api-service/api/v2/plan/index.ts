import { getRestApi } from '../../../libs/rest-api';

import { cancelPlan } from './cancel-plan';

export const planApi = getRestApi([
  //
  cancelPlan,
]);
