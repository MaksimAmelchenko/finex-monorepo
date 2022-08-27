import { OpenAPIV3 } from 'openapi-types';

import { date } from '../../../common/schemas/fields/date';

export const debtItemDAOSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'number',
    },
    cashflowId: {
      type: 'number',
    },
    id: {
      type: 'number',
    },
    userId: {
      type: 'number',
    },
    sign: {
      type: 'number',
      enum: [-1, 1],
    },
    amount: {
      type: 'number',
    },
    moneyId: {
      type: 'number',
    },
    cashflowItemDate: date,
    reportPeriod: date,
    accountId: {
      type: 'number',
    },
    categoryId: {
      type: 'number',
    },
    note: {
      type: 'string',
      nullable: true,
    },
    tags: {
      type: 'array',
      items: {
        type: 'number',
      },
      nullable: true,
    },
  },
  additionalProperties: false,
  required: [
    'projectId',
    'cashflowId',
    'userId',
    'sign',
    'amount',
    'moneyId',
    'cashflowItemDate',
    'reportPeriod',
    'accountId',
    'categoryId',
  ],
};
