import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const updateTransferParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      properties: {
        transferId: id,
        amount: {
          type: 'number',
        },
        moneyId,
        fromAccountId: accountId,
        toAccountId: accountId,
        transferDate: date,
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
      required: ['transferId', 'isFee'],
    },
    {
      type: 'object',
      properties: {
        transferId: id,
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
        note: {
          type: 'string',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        transferDate: date,
        reportPeriod: date,
        locale,
      },
      additionalProperties: false,
      required: ['transferId'],
    },
  ],
};
