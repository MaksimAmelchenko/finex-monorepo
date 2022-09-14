import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { date } from '../../../../common/schemas/fields/date';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { planId } from '../../../../common/schemas/fields/plan-id';
import { sign } from '../../../../common/schemas/fields/sign';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const createTransactionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowId: {
      type: ['string', 'null'],
    },
    sign,
    amount: {
      type: 'number',
      minimum: 0,
      exclusiveMinimum: true,
    },
    moneyId,
    accountId,
    categoryId,
    contractorId: {
      ...contractorId,
      type: ['string', 'null'],
    },
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
    planId: {
      ...planId,
      type: ['string', 'null'],
    },
  },
  additionalProperties: false,
  required: [
    //
    'sign',
    'amount',
    'moneyId',
    'accountId',
    'categoryId',
    'transactionDate',
    'reportPeriod',
  ],
};
