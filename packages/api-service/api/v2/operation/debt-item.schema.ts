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

export const debtItemSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    operationType: {
      type: 'string',
      enum: ['debtItem'],
    },
    id,
    debtId: id,
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    categoryId,
    accountId,
    debtItemDate: date,
    reportPeriod: date,
    contractorId,
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
    'operationType',
    'id',
    'debtId',
    'sign',
    'amount',
    'moneyId',
    'categoryId',
    'accountId',
    'debtItemDate',
    'reportPeriod',
    'contractorId',
    'note',
    'tags',
    'userId',
    'permit',
  ],
};
