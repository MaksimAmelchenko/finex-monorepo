import { OpenAPIV3_1 } from 'openapi-types';

import { idProject } from '../../../../common/schemas/fields/id-project';
import { idUser } from '../../../../common/schemas/fields/id-user';

export const sessionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    authorization: {
      type: 'string',
      description: 'Bearer Token',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiIwM2FmNjIyOS05ZmQyLTRiMmMtYWFkOS1kMjk0MGIwZWE0OGMiLCJpYXQiOjE2NjQ4MTE3NjV9.QtnyKcHngBfOiqY-WpsfXuoPWi0fxQLVu09LSQ-eVoU',
    },
    idUser,
    idProject,
  },
  additionalProperties: false,
  required: ['authorization', 'idUser', 'idProject'],
};
