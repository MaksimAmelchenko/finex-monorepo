import { OpenAPIV3 } from 'openapi-types';

import { projectId } from '../../../common/schemas/fields/project-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const projectSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: projectId,
    currencyId: {
      type: 'string',
      nullable: true,
    },
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
    permit: {
      type: 'integer',
    },
    editors: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    userId,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'note',
    'permit',
    'editors',
    'userId',
  ],
};
