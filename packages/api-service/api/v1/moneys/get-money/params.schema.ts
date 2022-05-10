import { OpenAPIV3 } from 'openapi-types';

import { idMoney } from '../../../../common/schemas/fields/id-money';

export const getMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idMoney,
  },
  additionalProperties: false,
  required: ['idMoney'],
};
