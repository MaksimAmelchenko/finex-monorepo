import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { date } from '../../../../common/schemas/fields/date';
import { locale } from '../../../../common/schemas/fields/locale';
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
        fromAccountId: accountId,
        toAccountId: accountId,
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
        locale,
      },
      additionalProperties: false,
      required: [
        //
        'amount',
        'moneyId',
        'fromAccountId',
        'toAccountId',
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
        fromAccountId: accountId,
        toAccountId: accountId,
        transferDate: date,
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
        'amount',
        'moneyId',
        'fromAccountId',
        'toAccountId',
        'transferDate',
        'reportPeriod',
        'fee',
        'feeMoneyId',
        'feeAccountId',
      ],
    },
  ],
};
