import { OpenAPIV3 } from 'openapi-types';

import { email } from '../../../common/schemas/fields/email';
import { projectId } from '../../../common/schemas/fields/project-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const profileSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: userId,
    name: {
      type: 'string',
      example: 'John Doe',
      minLength: 1,
    },
    email,
    projectId: {
      ...projectId,
      nullable: true,
    },
    currencyRateSourceId: {
      type: 'string',
    },
    tz: {
      type: 'string',
    },
    timeout: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'email',
    'projectId',
    'currencyRateSourceId',
    'tz',
    'timeout',
  ],
};
