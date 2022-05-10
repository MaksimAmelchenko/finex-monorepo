import { OpenAPIV3 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { cashFlowId } from '../../../common/schemas/fields/cash-flow-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { date } from '../../../common/schemas/fields/date';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { permit } from '../../../common/schemas/fields/permit';
import { planId } from '../../../common/schemas/fields/plan-id';
import { sign } from '../../../common/schemas/fields/sign';
import { unitId } from '../../../common/schemas/fields/unit-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const transactionSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    userId,
    id: {
      ...id,
      nullable: true,
    },
    cashFlowId: {
      ...id,
      nullable: true,
    },
    accountId,
    categoryId,
    sign,
    transactionDate: date,
    reportPeriod: date,
    amount: {
      type: 'number',
    },
    moneyId,
    contractorId: {
      ...contractorId,
      nullable: true,
    },
    quantity: {
      type: 'number',
      nullable: true,
    },
    unitId: {
      ...unitId,
      nullable: true,
    },
    isNotConfirmed: {
      type: 'boolean',
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
    permit,
    planId: {
      ...planId,
      nullable: true,
    },
    nRepeat: {
      type: 'integer',
      nullable: true,
    },
    colorMark: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: [
    'userId',
    'id',
    'cashFlowId',
    'sign',
    'amount',
    'moneyId',
    'accountId',
    'categoryId',
    'contractorId',
    'transactionDate',
    'reportPeriod',
    'quantity',
    'unitId',
    'isNotConfirmed',
    'note',
    'tags',
    'permit',
    'nRepeat',
    'colorMark',
  ],
};
