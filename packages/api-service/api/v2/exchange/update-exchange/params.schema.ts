import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const updateExchangeParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      properties: {
        exchangeId: id,
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
        locale,
      },
      additionalProperties: false,
      required: ['exchangeId', 'isFee'],
    },
    {
      type: 'object',
      properties: {
        exchangeId: id,
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
        locale,
      },
      additionalProperties: false,
      required: ['exchangeId'],
    },
  ],
};
