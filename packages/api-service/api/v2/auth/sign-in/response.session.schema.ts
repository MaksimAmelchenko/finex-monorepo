import { OpenAPIV3_1 } from 'openapi-types';

import { idProject } from '../../../../common/schemas/fields/id-project';
import { idUser } from '../../../../common/schemas/fields/id-user';
import { token } from '../../../../common/schemas/fields/token';

export const sessionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    authorization: token,
    idUser,
    idProject,
  },
  required: ['authorization', 'idUser', 'idProject'],
  additionalProperties: false,
};
