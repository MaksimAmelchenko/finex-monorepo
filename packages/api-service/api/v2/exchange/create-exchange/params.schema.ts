import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { date } from '../../../../common/schemas/fields/date';
import { locale } from '../../../../common/schemas/fields/locale';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const createExchangeParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      properties: {
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
        note: {
          type: 'string',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        locale,
      },
      additionalProperties: false,
      required: [
        //
        'amountSell',
        'moneySellId',
        'amountBuy',
        'moneyBuyId',
        'accountSellId',
        'accountBuyId',
        'exchangeDate',
        'reportPeriod',
      ],
    },
    {
      type: 'object',
      properties: {
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
        locale,
      },
      additionalProperties: false,
      required: [
        'amountSell',
        'moneySellId',
        'amountBuy',
        'moneyBuyId',
        'accountSellId',
        'accountBuyId',
        'exchangeDate',
        'reportPeriod',
        'fee',
        'moneyFeeId',
        'accountFeeId',
      ],
    },
  ],
};
