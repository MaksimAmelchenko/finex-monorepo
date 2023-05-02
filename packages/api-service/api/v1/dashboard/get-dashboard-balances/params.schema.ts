import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const getDashboardBalancesParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    balanceDate: date,
    moneyId: {
      ...id,
      type: ['string', 'null'],
    },
    locale,
  },
  additionalProperties: false,
  required: [
    //
    'balanceDate',
  ],
};
