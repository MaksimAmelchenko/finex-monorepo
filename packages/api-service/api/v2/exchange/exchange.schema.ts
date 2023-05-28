import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { date } from '../../../common/schemas/fields/date';
import { dateTime } from '../../../common/schemas/fields/date-time';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';

export const exchangeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  anyOf: [
    {
      type: 'object',
      properties: {
        userId: id,
        id,
        sellAmount: {
          type: 'number',
        },
        sellMoneyId: moneyId,
        buyAmount: {
          type: 'number',
        },
        buyMoneyId: moneyId,
        sellAccountId: accountId,
        buyAccountId: accountId,
        fee: {
          type: 'null',
        },
        feeMoneyId: {
          type: 'null',
        },
        feeAccountId: {
          type: 'null',
        },
        exchangeDate: date,
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
        'sellAmount',
        'sellMoneyId',
        'buyAmount',
        'buyMoneyId',
        'sellAccountId',
        'buyAccountId',
        'fee',
        'feeMoneyId',
        'feeAccountId',
        'exchangeDate',
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
        sellAmount: {
          type: 'number',
        },
        sellMoneyId: moneyId,
        buyAmount: {
          type: 'number',
        },
        buyMoneyId: moneyId,
        sellAccountId: accountId,
        buyAccountId: accountId,
        fee: {
          type: 'number',
        },
        feeMoneyId: moneyId,
        feeAccountId: accountId,
        exchangeDate: date,
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
        'sellAmount',
        'sellMoneyId',
        'buyAmount',
        'buyMoneyId',
        'sellAccountId',
        'buyAccountId',
        'fee',
        'feeMoneyId',
        'feeAccountId',
        'exchangeDate',
        'reportPeriod',
        'note',
        'tags',
        'userId',
        'updatedAt',
      ],
    },
  ],
};
