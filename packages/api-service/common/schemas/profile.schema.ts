import { OpenAPIV3 } from 'openapi-types';

import { userId } from './fields/user-id';
import { email } from './fields/email';
import { projectId } from './fields/project-id';

export const profileSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    name: {
      type: 'string',
      example: 'John Doe',
      minLength: 1,
    },
    email,
    idProject: projectId,
    idCurrencyRateSource: {
      type: 'integer',
    },
  },
  required: ['idUser', 'name', 'email', 'idProject', 'idCurrencyRateSource'],
  additionalProperties: false,
};
