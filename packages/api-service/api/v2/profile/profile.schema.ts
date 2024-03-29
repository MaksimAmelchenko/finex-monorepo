import { OpenAPIV3_1 } from 'openapi-types';

import { email } from '../../../common/schemas/fields/email';
import { projectId } from '../../../common/schemas/fields/project-id';
import { userId } from '../../../common/schemas/fields/user-id';
import { dateTime } from '../../../common/schemas/fields/date-time';

export const profileSchema: OpenAPIV3_1.SchemaObject = {
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
      type: ['integer', 'null'],
    },
    currencyRateSourceId: {
      type: 'string',
    },
    timeout: {
      type: 'string',
    },
    planId: {
      type: ['string', 'null'],
    },
    accessUntil: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'email',
    'projectId',
    'currencyRateSourceId',
    'timeout',
    'planId',
    'accessUntil',
  ],
};
