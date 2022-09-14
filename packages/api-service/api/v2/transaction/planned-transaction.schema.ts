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

export const plannedTransactionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    planId: id,
    contractorId: {
      type: ['number', 'null'],
    },
    markerColor: {
      type: 'string',
    },
    repetitionNumber: {
      type: 'number',
    },
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    accountId,
    categoryId,
    transactionDate: date,
    reportPeriod: date,
    quantity: {
      type: ['number', 'null'],
    },
    unitId: {
      ...unitId,
      type: ['integer', 'null'],
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
    userId,
    permit,
  },
  additionalProperties: false,
  required: [
    'planId',
    'contractorId',
    'markerColor',
    'repetitionNumber',
    'sign',
    'amount',
    'moneyId',
    'accountId',
    'categoryId',
    'transactionDate',
    'reportPeriod',
    'quantity',
    'unitId',
    'note',
    'tags',
    'userId',
    'permit',
  ],
};
