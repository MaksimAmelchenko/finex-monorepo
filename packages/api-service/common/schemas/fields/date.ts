import { OpenAPIV3 } from 'openapi-types';

export const date: OpenAPIV3.SchemaObject = {
  type: 'string',
  format: 'date',
  example: '2017-05-21',
};
