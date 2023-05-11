import { OpenAPIV3_1 } from 'openapi-types';

export const createRequisitionResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    link: {
      type: 'string',
      format: 'uri',
    },
  },
  additionalProperties: false,
  required: ['link'],
};
