import { OpenAPIV3_1 } from 'openapi-types';

import { idMoney } from '../../../../common/schemas/fields/id-money';

export const sortMoneysParamsSchema: OpenAPIV3_1.SchemaObject = {
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
