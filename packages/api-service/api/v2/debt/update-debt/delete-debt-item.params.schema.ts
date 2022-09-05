import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteDebtItemParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    _destroy: { type: 'boolean', enum: [true] },
  },
  additionalProperties: false,
  required: [
    //
    'id',
    '_destroy',
  ],
};
