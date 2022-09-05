import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const getTransferParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transferId: id,
  },
  additionalProperties: false,
  required: ['transferId'],
};
