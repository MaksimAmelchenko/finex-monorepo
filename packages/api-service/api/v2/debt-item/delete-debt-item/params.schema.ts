import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteDebtItemParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    debtId: id,
    debtItemId: id,
  },
  additionalProperties: false,
  required: ['debtItemId'],
};
