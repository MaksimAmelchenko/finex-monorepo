import { getRestApi } from '../../../libs/rest-api';

import { createExchange } from './create-exchange';
import { deleteDebt } from './delete-exchange';
import { findExchanges } from './find-exchanges';
import { getExchange } from './get-exchange';
import { updateExchange } from './update-exchange';

export const exchangeApi = getRestApi([
  //
  createExchange,
  deleteDebt,
  findExchanges,
  getExchange,
  updateExchange,
]);
