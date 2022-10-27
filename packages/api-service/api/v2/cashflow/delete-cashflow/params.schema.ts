import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteCashFlowParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowId: id,
  },
  additionalProperties: false,
  required: ['cashFlowId'],
};
