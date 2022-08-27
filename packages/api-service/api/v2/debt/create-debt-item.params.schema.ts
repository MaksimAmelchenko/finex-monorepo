import { OpenAPIV3 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { date } from '../../../common/schemas/fields/date';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { sign } from '../../../common/schemas/fields/sign';

export const createDebtItemParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    accountId,
    categoryId,
    debtItemDate: date,
    reportPeriod: date,
    note: {
      type: 'string',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
  required: [
    //
    'sign',
    'amount',
    'moneyId',
    'accountId',
    'categoryId',
    'debtItemDate',
    'reportPeriod',
  ],
};
