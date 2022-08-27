import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { findDebtParamsSchema } from './params.schema';
import { findDebtsResponseSchema } from './response.schema';

export const findDebts: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/debts',
  handler,
  schemas: {
    params: findDebtParamsSchema,
    response: findDebtsResponseSchema,
  },
};
