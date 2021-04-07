import { OpenAPIV3 } from 'openapi-types';

export const dateTime: OpenAPIV3.SchemaObject = {
  type: 'string',
  format: 'date-time',
  example: '2021-05-21T21:58:18Z',
};
