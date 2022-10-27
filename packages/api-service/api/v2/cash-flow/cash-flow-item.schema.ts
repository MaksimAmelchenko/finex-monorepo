import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { date } from '../../../common/schemas/fields/date';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { permit } from '../../../common/schemas/fields/permit';
import { sign } from '../../../common/schemas/fields/sign';
import { unitId } from '../../../common/schemas/fields/unit-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const cashFlowItemSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowId: id,
    id,
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    cashFlowItemDate: date,
    reportPeriod: date,
    accountId,
    categoryId,
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
    permit,
    userId,
  },
  additionalProperties: false,
  required: [
    'cashFlowId',
    'id',
    'accountId',
    'categoryId',
    'sign',
    'amount',
    'moneyId',
    'cashFlowItemDate',
    'reportPeriod',
    'quantity',
    'unitId',
    'isNotConfirmed',
    'note',
    'tags',
    'permit',
    'userId',
  ],
};
