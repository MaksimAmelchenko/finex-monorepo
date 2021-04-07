import { getRestApi } from '../../../libs/rest-api';

import { cancelPlan } from './cancel-plan';
import { createExchangePlan } from './create-exchange-plan';
import { createIePlan } from './create-ie-plan';
import { createTransferPlan } from './create-transfer-plan';
import { deleteExchangePlan } from './delete-exchange-plan';
import { deleteIePlan } from './delete-ie-plan';
import { deleteTransferPlan } from './delete-transfer-plan';
import { getExchangePlans } from './get-exchange-plans';
import { getIePlans } from './get-ie-plans';
import { getTransferPlans } from './get-transfer-plans';
import { updateExchangePlan } from './update-exchange-plan';
import { updateIePlan } from './update-ie-plan';
import { updateTransferPlan } from './update-transfer-plan';

export const plansApi = getRestApi([
  cancelPlan,
  createExchangePlan,
  createIePlan,
  createTransferPlan,
  deleteExchangePlan,
  deleteIePlan,
  deleteTransferPlan,
  getExchangePlans,
  getIePlans,
  getTransferPlans,
  updateExchangePlan,
  updateIePlan,
  updateTransferPlan,
]);
