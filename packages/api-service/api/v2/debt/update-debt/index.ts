import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateDebtParamsSchema } from './params.schema';
import { updateDebtResponseSchema } from './response.schema';

export const updateDebt: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/debts/:debtId',
  handler,
  schemas: {
    params: updateDebtParamsSchema,
    response: updateDebtResponseSchema,
  },
};
