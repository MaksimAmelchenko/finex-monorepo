import { OpenAPIV3_1 } from 'openapi-types';

import { transferSchema } from '../transfer.schema';

export const createTransferResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transfer: transferSchema,
  },
  additionalProperties: false,
  required: ['transfer'],
};
