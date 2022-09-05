import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { date } from '../../../../common/schemas/fields/date';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const createTransferParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
        },
        moneyId,
        accountFromId: accountId,
        accountToId: accountId,
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
      },
      additionalProperties: false,
      required: [
        //
        'amount',
        'moneyId',
        'accountFromId',
        'accountToId',
        'transferDate',
        'reportPeriod',
      ],
    },
    {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
        },
        moneyId,
        accountFromId: accountId,
        accountToId: accountId,
        transferDate: date,
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
      },
      additionalProperties: false,
      required: [
        'amount',
        'moneyId',
        'accountFromId',
        'accountToId',
        'transferDate',
        'reportPeriod',
        'fee',
        'moneyFeeId',
        'accountFeeId',
      ],
    },
  ],
};
