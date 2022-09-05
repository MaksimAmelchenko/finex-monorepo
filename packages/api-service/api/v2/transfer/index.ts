import { getRestApi } from '../../../libs/rest-api';

import { createTransfer } from './create-transfer';
import { deleteDebt } from './delete-transfer';
import { findTransfers } from './find-transfers';
import { getTransfer } from './get-transfer';
import { updateTransfer } from './update-transfer';

export const transferApi = getRestApi([
  //
  createTransfer,
  deleteDebt,
  findTransfers,
  getTransfer,
  updateTransfer,
]);
