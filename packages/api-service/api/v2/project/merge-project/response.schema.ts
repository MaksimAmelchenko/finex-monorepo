import { OpenAPIV3_1 } from 'openapi-types';

export const mergeProjectResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accountsCount: {
      type: 'integer',
    },
    contractorsCount: {
      type: 'integer',
    },
    categoriesCount: {
      type: 'integer',
    },
    unitsCount: {
      type: 'integer',
    },
    tagsCount: {
      type: 'integer',
    },
    moneysCount: {
      type: 'integer',
    },
    plansCount: {
      type: 'integer',
    },
    cashFlowsCount: {
      type: 'integer',
    },
    cashFlowDetailsCount: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: [
    'accountsCount',
    'contractorsCount',
    'categoriesCount',
    'unitsCount',
    'tagsCount',
    'moneysCount',
    'plansCount',
    'cashFlowsCount',
    'cashFlowDetailsCount',
  ],
};
