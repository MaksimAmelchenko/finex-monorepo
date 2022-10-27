import { getRestApi } from '../../../libs/rest-api';

import { createCashFlow } from './create-cashflow';
import { deleteCashFlow } from './delete-cashflow';
import { findCashFlows } from './find-cashflows';
import { updateCashFlow } from './update-cashflow';

export const cashFlowApi = getRestApi([
  //
  createCashFlow,
  deleteCashFlow,
  findCashFlows,
  updateCashFlow,
]);
