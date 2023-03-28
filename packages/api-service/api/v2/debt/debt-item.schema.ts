import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { date } from '../../../common/schemas/fields/date';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { permit } from '../../../common/schemas/fields/permit';
import { sign } from '../../../common/schemas/fields/sign';
import { userId } from '../../../common/schemas/fields/user-id';

export const debtItemSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    debtId: id,
    id,
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    debtItemDate: date,
    reportPeriod: date,
    accountId,
    categoryId,
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
    contractorId,
  },
  additionalProperties: false,
  required: [
    'debtId',
    'id',
    'accountId',
    'categoryId',
    'sign',
    'amount',
    'moneyId',
    'debtItemDate',
    'reportPeriod',
    'note',
    'tags',
    'permit',
    'userId',
    'contractorId',
  ],
};
