import { getRestApi } from '../../../libs/rest-api';

import { getDistributionReport } from './distribution-report';
import { getDynamicsReport } from './dynamics-report';

export const reportApi = getRestApi([
  //
  getDistributionReport,
  getDynamicsReport,
]);
