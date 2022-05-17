import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteAccountParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    accountId: id,
  },
  additionalProperties: false,
  required: ['accountId'],
};
