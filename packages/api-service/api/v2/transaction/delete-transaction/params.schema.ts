import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteTransactionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transactionId: id,
  },
  additionalProperties: false,
  required: ['transactionId'],
};
