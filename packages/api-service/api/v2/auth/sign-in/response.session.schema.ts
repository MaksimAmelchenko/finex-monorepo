import { OpenAPIV3 } from 'openapi-types';

import { token } from '../../../../common/schemas/fields/token';
import { projectId } from '../../../../common/schemas/fields/project-id';
import { userId } from '../../../../common/schemas/fields/user-id';

export const sessionSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    authorization: token,
    idUser: userId,
    idProject: projectId,
  },
  required: ['authorization', 'idUser', 'idProject'],
  additionalProperties: false,
};
