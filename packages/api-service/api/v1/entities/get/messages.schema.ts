import { OpenAPIV3_1 } from 'openapi-types';

export const messagesSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    welcome: {
      type: 'string',
    },
    changeLog: {
      type: 'string',
    },
  },
  additionalProperties: false,
};
