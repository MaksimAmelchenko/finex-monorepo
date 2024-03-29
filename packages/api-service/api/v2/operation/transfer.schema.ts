import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { date } from '../../../common/schemas/fields/date';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const transferSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    operationType: {
      type: 'string',
      enum: ['transfer'],
    },
    id,
    amount: {
      type: 'number',
    },
    moneyId,
    fromAccountId: accountId,
    toAccountId: accountId,
    transferDate: date,
    reportPeriod: date,
    fee: {
      type: 'number',
    },
    feeMoneyId: moneyId,
    feeAccountId: accountId,
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
  },
  additionalProperties: false,
  required: [
    'operationType',
    'id',
    'amount',
    'moneyId',
    'fromAccountId',
    'toAccountId',
    'transferDate',
    'reportPeriod',
    'fee',
    'feeMoneyId',
    'feeAccountId',
    'note',
    'tags',
    'userId',
  ],
};
