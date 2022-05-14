import { createTransaction } from './methods/create-transaction';
import { deleteTransaction } from './methods/delete-transaction';
import { getTransactions } from './methods/get-transactions';
import { updateTransaction } from './methods/update-transaction';

export const TransactionGateway = {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
};
