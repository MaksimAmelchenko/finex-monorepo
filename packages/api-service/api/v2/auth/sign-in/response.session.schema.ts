import { OpenAPIV3 } from 'openapi-types';

import { token } from '../../../../common/schemas/fields/token';
import { idProject } from '../../../../common/schemas/fields/id-project';
import { idUser } from '../../../../common/schemas/fields/id-user';

export const sessionSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    authorization: token,
    idUser,
    idProject,
  },
  required: ['authorization', 'idUser', 'idProject'],
  additionalProperties: false,
};
