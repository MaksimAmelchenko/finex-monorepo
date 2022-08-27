import { getRestApi } from '../../../libs/rest-api';

import { createDebt } from './create-debt';
import { deleteDebt } from './delete-debt';
import { findDebts } from './find-debts';
import { updateDebt } from './update-debt';

export const debtApi = getRestApi([
  //
  createDebt,
  deleteDebt,
  findDebts,
  updateDebt,
]);
