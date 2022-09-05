import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { date } from '../../../../common/schemas/fields/date';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { id } from '../../../../common/schemas/fields/id';

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
        accountFromId: accountId,
        accountToId: accountId,
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
        accountFromId: accountId,
        accountToId: accountId,
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
        transferDate: date,
        reportPeriod: date,
      },
      additionalProperties: false,
      required: ['transferId'],
    },
  ],
};
