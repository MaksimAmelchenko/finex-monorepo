import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { date } from '../../../common/schemas/fields/date';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { permit } from '../../../common/schemas/fields/permit';
import { sign } from '../../../common/schemas/fields/sign';
import { unitId } from '../../../common/schemas/fields/unit-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const transactionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    cashFlowId: id,
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    categoryId,
    accountId,
    transactionDate: date,
    reportPeriod: date,
    contractorId: {
      ...contractorId,
      type: ['integer', 'null'],
    },
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
    'id',
    'cashFlowId',
    'sign',
    'amount',
    'moneyId',
    'categoryId',
    'accountId',
    'transactionDate',
    'reportPeriod',
    'contractorId',
    'quantity',
    'unitId',
    'isNotConfirmed',
    'note',
    'tags',
    'permit',
    'userId',
  ],
};
