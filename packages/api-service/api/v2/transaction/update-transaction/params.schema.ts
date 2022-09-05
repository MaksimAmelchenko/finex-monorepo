import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { sign } from '../../../../common/schemas/fields/sign';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const updateTransactionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transactionId: id,
    sign,
    amount: {
      type: 'number',
      minimum: 0,
      exclusiveMinimum: true,
    },
    moneyId,
    accountId,
    categoryId,
    transactionDate: date,
    reportPeriod: date,
    quantity: {
      type: ['number', 'null'],
      minimum: 0,
      exclusiveMinimum: true,
    },
    unitId: {
      ...unitId,
      type: ['string', 'null'],
    },
    isNotConfirmed: {
      type: 'boolean',
      default: false,
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
  required: [
    //
    'transactionId',
  ],
};
