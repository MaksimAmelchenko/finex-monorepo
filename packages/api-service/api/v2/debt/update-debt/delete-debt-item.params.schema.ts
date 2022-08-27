import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const deleteDebtItemParamsSchema: OpenAPIV3.SchemaObject = {
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
