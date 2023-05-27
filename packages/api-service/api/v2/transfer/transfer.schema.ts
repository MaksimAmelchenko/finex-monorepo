import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { date } from '../../../common/schemas/fields/date';
import { dateTime } from '../../../common/schemas/fields/date-time';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';

export const transferSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  anyOf: [
    {
      type: 'object',
      properties: {
        userId: id,
        id,
        amount: {
          type: 'number',
        },
        moneyId,
        fromAccountId: accountId,
        toAccountId: accountId,
        fee: {
          type: 'null',
        },
        feeMoneyId: {
          type: 'null',
        },
        feeAccountId: {
          type: 'null',
        },
        transferDate: date,
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
        updatedAt: dateTime,
      },
      additionalProperties: false,
      required: [
        'id',
        'amount',
        'moneyId',
        'fromAccountId',
        'toAccountId',
        'fee',
        'feeMoneyId',
        'feeAccountId',
        'transferDate',
        'reportPeriod',
        'note',
        'tags',
        'userId',
        'updatedAt',
      ],
    },
    {
      type: 'object',
      properties: {
        userId: id,
        id,
        amount: {
          type: 'number',
        },
        moneyId,
        fromAccountId: accountId,
        toAccountId: accountId,
        fee: {
          type: 'number',
        },
        feeMoneyId: moneyId,
        feeAccountId: accountId,
        transferDate: date,
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
        updatedAt: dateTime,
      },
      additionalProperties: false,
      required: [
        'id',
        'amount',
        'moneyId',
        'fromAccountId',
        'toAccountId',
        'fee',
        'feeMoneyId',
        'feeAccountId',
        'transferDate',
        'reportPeriod',
        'note',
        'tags',
        'userId',
        'updatedAt',
      ],
    },
  ],
};
