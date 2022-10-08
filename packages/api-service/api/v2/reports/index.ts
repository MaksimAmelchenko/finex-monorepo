import { getRestApi } from '../../../libs/rest-api';

import { getDynamicsReport } from './dynamics-report';

export const reportApi = getRestApi([
  //
  getDynamicsReport,
]);
