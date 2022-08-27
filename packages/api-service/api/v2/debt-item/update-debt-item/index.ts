import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateDebtItemParamsSchema } from './params.schema';
import { updateDebtItemResponseSchema } from './response.schema';

export const updateDebtItem: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/debts/:debtId/items/:debtItemId',
  handler,
  schemas: {
    params: updateDebtItemParamsSchema,
    response: updateDebtItemResponseSchema,
  },
};
