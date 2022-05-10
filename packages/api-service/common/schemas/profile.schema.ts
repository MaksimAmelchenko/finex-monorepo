import { OpenAPIV3 } from 'openapi-types';

import { idUser } from './fields/id-user';
import { email } from './fields/email';
import { idProject } from './fields/id-project';

export const profileSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser,
    name: {
      type: 'string',
      example: 'John Doe',
      minLength: 1,
    },
    email,
    idProject,
    idCurrencyRateSource: {
      type: 'integer',
    },
  },
  required: ['idUser', 'name', 'email', 'idProject', 'idCurrencyRateSource'],
  additionalProperties: false,
};
