import { getRestApi } from '../../../libs/rest-api';

import { createTransaction } from './create-transaction';
import { deleteTransaction } from './delete-transaction';
import { getTransactions } from './get-transactions';
import { updateTransaction } from './update-transaction';

export const transactionApi = getRestApi([
  //
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
]);
