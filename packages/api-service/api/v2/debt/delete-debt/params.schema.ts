import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteDebtParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    debtId: id,
  },
  additionalProperties: false,
  required: ['debtId'],
};
