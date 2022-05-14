import { createTransaction } from './methods/create-transaction';
import { getTransactions } from './methods/get-transactions';
import { updateTransaction } from './methods/update-transaction';

export const TransactionGateway = {
  createTransaction,
  getTransactions,
  updateTransaction,
};
