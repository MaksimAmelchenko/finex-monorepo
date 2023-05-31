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
        'sellAmount',
        'sellMoneyId',
        'buyAmount',
        'buyMoneyId',
        'sellAccountId',
        'buyAccountId',
        'exchangeDate',
        'reportPeriod',
      ],
    },
    {
      type: 'object',
      properties: {
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
        exchangeDate: date,
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
        locale,
      },
      additionalProperties: false,
      required: [
        'sellAmount',
        'sellMoneyId',
        'buyAmount',
        'buyMoneyId',
        'sellAccountId',
        'buyAccountId',
        'exchangeDate',
        'reportPeriod',
        'fee',
        'feeMoneyId',
        'feeAccountId',
      ],
    },
  ],
};
