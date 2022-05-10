import { OpenAPIV3 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { date } from '../../../../common/schemas/fields/date';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { planId } from '../../../../common/schemas/fields/plan-id';
import { sign } from '../../../../common/schemas/fields/sign';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const createTransactionParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    sign,
    amount: {
      type: 'number',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      exclusiveMinimum: 0,
    },
    moneyId,
    accountId,
    categoryId,
    contractorId: {
      ...contractorId,
      nullable: true,
    },
    transactionDate: date,
    reportPeriod: date,
    quantity: {
      type: 'number',
      nullable: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      exclusiveMinimum: 0,
    },
    unitId: {
      ...unitId,
      nullable: true,
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
      nullable: true,
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
