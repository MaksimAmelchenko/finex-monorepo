import { OpenAPIV3_1 } from 'openapi-types';

export const planTransactionDaoSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'number',
    },
    planId: {
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
    contractorId: {
      type: ['number', 'null'],
    },
    quantity: {
      type: ['number', 'null'],
    },
    unitId: {
      type: ['number', 'null'],
    },
  },
  additionalProperties: false,
  required: [
    //
    'projectId',
    'planId',
    'sign',
    'amount',
    'moneyId',
    'categoryId',
    'accountId',
  ],
};
