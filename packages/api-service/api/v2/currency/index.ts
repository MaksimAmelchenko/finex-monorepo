import { getRestApi } from '../../../libs/rest-api';

import { getCurrencies } from './get-currencies';

export const currencyApi = getRestApi([
  //
  getCurrencies,
]);
