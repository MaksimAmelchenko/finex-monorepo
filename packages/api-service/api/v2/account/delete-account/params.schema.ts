import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accountId: id,
  },
  additionalProperties: false,
  required: ['accountId'],
};
