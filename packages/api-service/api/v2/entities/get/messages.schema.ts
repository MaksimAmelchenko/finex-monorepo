import { OpenAPIV3 } from 'openapi-types';

export const messagesSchema: OpenAPIV3.SchemaObject = {
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
