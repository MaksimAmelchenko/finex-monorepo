import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { uploadCurrencyRatesParamsSchema } from './params.schema';
import { uploadCurrencyRatesResponseSchema } from './response.schema';

export const uploadCurrencyRates: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/currency-rates/upload',
  handler,
  schemas: {
    params: uploadCurrencyRatesParamsSchema,
    response: uploadCurrencyRatesResponseSchema,
  },
  isNeedAuthorization: false,
};
