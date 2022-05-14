import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteTransactionParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    transactionId: id,
  },
  additionalProperties: false,
  required: ['transactionId'],
};
