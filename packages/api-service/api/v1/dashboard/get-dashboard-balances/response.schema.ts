import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

const balanceSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    moneyId: id,
    amount: {
      type: 'number',
    },
  },
  additionalProperties: false,
  required: ['moneyId', 'amount'],
};

export const getDashboardBalancesResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accountsBalances: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          accountId: {
            type: 'string',
          },
          balances: {
            type: 'array',
            items: balanceSchema,
          },
        },
        additionalProperties: false,
        required: ['accountId', 'balances'],
      },
    },
    debtsBalances: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          contractorId: {
            type: 'string',
          },
          debtType: {
            type: 'number',
            enum: [1, 2],
          },
          balances: {
            type: 'array',
            items: balanceSchema,
          },
        },
        additionalProperties: false,
        required: ['contractorId', 'debtType', 'balances'],
      },
    },
  },
  additionalProperties: false,
  required: ['accountsBalances', 'debtsBalances'],
};
