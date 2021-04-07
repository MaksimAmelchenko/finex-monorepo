import { getRestApi } from '../../../libs/rest-api';

import { createExchange } from './create-exchange';
import { deleteExchange } from './delete-exchange';
import { getExchanges } from './get-exchanges';
import { getExchange } from './get-exchange';
import { updateExchange } from './update-exchange';

export const exchangesApi = getRestApi([
  //
  createExchange,
  deleteExchange,
  getExchanges,
  getExchange,
  updateExchange,
]);
