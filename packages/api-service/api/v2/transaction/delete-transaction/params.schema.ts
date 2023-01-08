import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const deleteTransactionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transactionId: id,
    locale,
  },
  additionalProperties: false,
  required: ['transactionId'],
};
