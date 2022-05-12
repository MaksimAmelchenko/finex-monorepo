import { createTransactions } from './methods/create-transaction';
import { getTransactions } from './methods/get-transactions';
import { updateTransactions } from './methods/update-transaction';

export const TransactionGateway = {
  createTransactions,
  getTransactions,
  updateTransactions,
};
