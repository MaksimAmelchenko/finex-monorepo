import { getRestApi } from '../../../libs/rest-api';

import { createCashFlow } from './create-cash-flow';
import { deleteCashFlow } from './delete-cash-flow';
import { findCashFlows } from './find-cash-flows';
import { updateCashFlow } from './update-cash-flow';

export const cashFlowApi = getRestApi([
  //
  createCashFlow,
  deleteCashFlow,
  findCashFlows,
  updateCashFlow,
]);
