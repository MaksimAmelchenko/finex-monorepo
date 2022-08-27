import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteDebtItemParamsSchema } from './params.schema';

export const deleteDebtItem: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/debts/:debtId/items/:debtItemId',
  handler,
  schemas: {
    params: deleteDebtItemParamsSchema,
  },
};
