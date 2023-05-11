import { getRestApi } from '../../../libs/rest-api';

import { completeRequisition } from './complete-requisition';
import { createRequisition } from './create-requisition';

export const connectionNordigenApi = getRestApi([
  //
  completeRequisition,
  createRequisition,
]);
