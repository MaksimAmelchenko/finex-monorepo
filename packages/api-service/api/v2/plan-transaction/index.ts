import { getRestApi } from '../../../libs/rest-api';

import { createPlanTransaction } from './create-plan-transaction';
import { deletePlanTransaction } from './delete-plan-transaction';
import { getPlanTransactions } from './get-plan-transactions';
import { updateTransaction } from './update-plan-transaction';

export const planTransactionApi = getRestApi([
  //
  createPlanTransaction,
  deletePlanTransaction,
  getPlanTransactions,
  updateTransaction,
]);
