import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteDebtItemParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    debtId: id,
    debtItemId: id,
  },
  additionalProperties: false,
  required: ['debtItemId'],
};
