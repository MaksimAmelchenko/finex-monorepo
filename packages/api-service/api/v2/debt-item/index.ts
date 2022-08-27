import { getRestApi } from '../../../libs/rest-api';

import { createDebtItem } from './create-debt-item';
import { deleteDebtItem } from './delete-debt-item';
import { updateDebtItem } from './update-debt-item';

export const debtItemApi = getRestApi([
  //
  createDebtItem,
  deleteDebtItem,
  updateDebtItem,
]);
