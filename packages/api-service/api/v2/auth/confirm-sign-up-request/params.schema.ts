import { OpenAPIV3 } from 'openapi-types';
import { token } from '../../../../common/schemas/parameters/token';

export const confirmSignUpRequestParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    token,
  },
  required: ['token'],
};
