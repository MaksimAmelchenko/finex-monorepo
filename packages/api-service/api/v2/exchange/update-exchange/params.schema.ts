import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { date } from '../../../../common/schemas/fields/date';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { id } from '../../../../common/schemas/fields/id';

export const updateExchangeParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      properties: {
        exchangeId: id,
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
        exchangeDate: date,
        reportPeriod: date,
        isFee: {
          type: 'boolean',
          enum: [false],
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
      required: ['exchangeId', 'isFee'],
    },
    {
      type: 'object',
      properties: {
        exchangeId: id,
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
        note: {
          type: 'string',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        exchangeDate: date,
        reportPeriod: date,
      },
      additionalProperties: false,
      required: ['exchangeId'],
    },
  ],
};
