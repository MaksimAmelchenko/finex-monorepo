import { OpenAPIV3 } from 'openapi-types';

export const createContractorParamsSchema: OpenAPIV3.SchemaObject = {
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
