import { getRestApi } from '../../../libs/rest-api';

import { uploadCurrencyRates } from './upload-currency-rates';

export const currencyRatesApi = getRestApi([
  //
  uploadCurrencyRates,
]);
