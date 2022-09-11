import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const getExchangeParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    exchangeId: id,
  },
  additionalProperties: false,
  required: ['exchangeId'],
};
