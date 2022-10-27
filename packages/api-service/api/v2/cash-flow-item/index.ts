import { getRestApi } from '../../../libs/rest-api';

import { createCashFlowItem } from './create-cash-flow-item';
import { deleteCashFlowItem } from './delete-cash-flow-item';
import { updateCashFlowItem } from './update-cash-flow-item';

export const cashFlowItemApi = getRestApi([
  //
  createCashFlowItem,
  deleteCashFlowItem,
  updateCashFlowItem,
]);
