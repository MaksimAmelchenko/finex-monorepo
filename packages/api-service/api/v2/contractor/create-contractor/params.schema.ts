import { OpenAPIV3_1 } from 'openapi-types';

export const createContractorParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
  },

  additionalProperties: false,
  required: ['name'],
};
