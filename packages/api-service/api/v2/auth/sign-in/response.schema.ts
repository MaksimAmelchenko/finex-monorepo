import { OpenAPIV3_1 } from 'openapi-types';
import { sessionSchema } from './response.session.schema';

export const signInResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  oneOf: [sessionSchema],
};
