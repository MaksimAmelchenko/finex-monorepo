import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteCashFlowItemParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowId: id,
    cashFlowItemId: id,
  },
  additionalProperties: false,
  required: ['cashFlowItemId'],
};
