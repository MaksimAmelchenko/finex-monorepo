import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { date } from '../../../common/schemas/fields/date';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { sign } from '../../../common/schemas/fields/sign';
import { unitId } from '../../../common/schemas/fields/unit-id';

export const createCashFlowItemParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    accountId,
    categoryId,
    cashFlowItemDate: date,
    reportPeriod: date,
    quantity: {
      type: ['number', 'null'],
    },
    unitId: {
      ...unitId,
      type: ['integer', 'null'],
    },
    isNotConfirmed: {
      type: 'boolean',
    },
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
    'cashFlowItemDate',
    'reportPeriod',
  ],
};
