import { getRestApi } from '../../../libs/rest-api';

import { createTransfer } from './create-transfer';
import { deleteTransfer } from './delete-transfer';
import { getTransfers } from './get-transfers';
import { getTransfer } from './get-transfer';
import { updateTransfer } from './update-transfer';

export const transfersApi = getRestApi([
  //
  createTransfer,
  deleteTransfer,
  getTransfers,
  getTransfer,
  updateTransfer,
]);
