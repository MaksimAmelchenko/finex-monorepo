import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../common/schemas/fields/date';

export const cashFlowItemDAOSchema: OpenAPIV3_1.SchemaObject = {
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
    accountId: {
      type: 'number',
    },
    categoryId: {
      type: 'number',
    },
    note: {
      type: ['string', 'null'],
    },
    tags: {
      type: ['array', 'null'],
      items: {
        type: 'number',
      },
    },
    cashflowItemDate: date,
    reportPeriod: date,
  },
  additionalProperties: false,
  required: [
    'projectId',
    'cashflowId',
    'userId',
    'sign',
    'amount',
    'moneyId',
    'accountId',
    'categoryId',
    'cashflowItemDate',
    'reportPeriod',
  ],
};
