import { createTransactions } from './methods/create-transaction';
import { getTransactions } from './methods/get-transactions';

export const TransactionGateway = {
  createTransactions,
  getTransactions,
};
