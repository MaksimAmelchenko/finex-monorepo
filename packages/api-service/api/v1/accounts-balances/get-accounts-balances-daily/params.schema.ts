import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const getAccountsBalancesDailyParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    startDate: date,
    endDate: date,
    moneyId: {
      ...id,
      type: ['string', 'null'],
    },
    locale,
  },
  additionalProperties: false,
  required: [
    //
    'startDate',
    'endDate',
  ],
};
