import { getRestApi } from '../../../libs/rest-api';

import { createTransaction } from './create-transaction';
import { getTransactions } from './get-transactions';

export const transactionApi = getRestApi([
  //
  createTransaction,
  getTransactions,
]);
