import { OpenAPIV3 } from 'openapi-types';
import { sessionSchema } from './response.session.schema';

export const signInResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  oneOf: [sessionSchema],
};
