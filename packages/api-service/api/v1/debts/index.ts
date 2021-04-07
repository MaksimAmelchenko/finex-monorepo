import { getRestApi } from '../../../libs/rest-api';

import { createDebt } from './create-debt';
import { deleteDebt } from './delete-debt';
import { getDebts } from './get-debts';
import { getDebt } from './get-debt';
import { updateDebt } from './update-debt';

export const debtsApi = getRestApi([
  //
  createDebt,
  deleteDebt,
  getDebts,
  getDebt,
  updateDebt,
]);
