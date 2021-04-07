import { OpenAPIV3 } from 'openapi-types';

export const emptyString: OpenAPIV3.SchemaObject = {
  type: 'string',
  maxLength: 0,
  example: '',
};
