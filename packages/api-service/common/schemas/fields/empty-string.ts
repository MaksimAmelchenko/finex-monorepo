import { OpenAPIV3_1 } from 'openapi-types';

export const emptyString: OpenAPIV3_1.SchemaObject = {
  type: 'string',
  maxLength: 0,
  example: '',
};
