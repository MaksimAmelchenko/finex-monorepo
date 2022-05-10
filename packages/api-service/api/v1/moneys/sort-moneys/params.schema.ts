import { OpenAPIV3 } from 'openapi-types';

import { idMoney } from '../../../../common/schemas/fields/id-money';

export const sortMoneysParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    moneys: {
      type: 'array',
      items: idMoney,
    },
  },
  additionalProperties: false,
  required: ['moneys'],
};
