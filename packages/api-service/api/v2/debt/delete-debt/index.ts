import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteDebtParamsSchema } from './params.schema';

export const deleteDebt: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/debts/:debtId',
  handler,
  schemas: {
    params: deleteDebtParamsSchema,
  },
};
