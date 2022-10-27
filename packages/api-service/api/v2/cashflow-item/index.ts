import { getRestApi } from '../../../libs/rest-api';

import { createCashFlowItem } from './create-cashflow-item';
import { deleteCashFlowItem } from './delete-cashflow-item';
import { updateCashFlowItem } from './update-cashflow-item';

export const cashFlowItemApi = getRestApi([
  //
  createCashFlowItem,
  deleteCashFlowItem,
  updateCashFlowItem,
]);
