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
        amountSell: {
          type: 'number',
        },
        moneySellId: moneyId,
        amountBuy: {
          type: 'number',
        },
        moneyBuyId: moneyId,
        accountSellId: accountId,
        accountBuyId: accountId,
        fee: {
          type: 'null',
        },
        moneyFeeId: {
          type: 'null',
        },
        accountFeeId: {
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
        'amountSell',
        'moneySellId',
        'amountBuy',
        'moneyBuyId',
        'accountSellId',
        'accountBuyId',
        'fee',
        'moneyFeeId',
        'accountFeeId',
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
        amountSell: {
          type: 'number',
        },
        moneySellId: moneyId,
        amountBuy: {
          type: 'number',
        },
        moneyBuyId: moneyId,
        accountSellId: accountId,
        accountBuyId: accountId,
        fee: {
          type: 'number',
        },
        moneyFeeId: moneyId,
        accountFeeId: accountId,
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
        'amountSell',
        'moneySellId',
        'amountBuy',
        'moneyBuyId',
        'accountSellId',
        'accountBuyId',
        'fee',
        'moneyFeeId',
        'accountFeeId',
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
